
interface IStackError { (error: Error, action: Action, actionChain: Array<Action>): void; }

interface IStackAction { (action: Action, actionChain: Array<Action>): void; }

interface IStackComplete { (stack: ActionStack): void; }


class ActionStack {

    stack : Array<Action> = [];

    chain : Array<Action> = [];
    
    parentStack : ActionStack = null;
    
    private rootStack : ActionStack = this; 
    
    onError : Collections.List<IStackError> = new Collections.List<IStackError>();

    onActionSuccess : Collections.List<IStackAction> = new Collections.List<IStackAction>();

    onStackComplete : IStackComplete = null; // Collections.List<IStackComplete> = new Collections.List<IStackComplete>();

    onBeforeAction : Collections.List<IStackAction> = new Collections.List<IStackAction>();


    /*
     *  putOnStack
     */ 
    putOnStack(action:Action): void {
        this.stack.push(action);
    }



    /*
     *  run
     */ 
    run(): void {
        var currentAction: Action = this.stack.pop() || null;

        if (currentAction != null) {
            if (currentAction.isComplex()) {
                var nestedStack : ActionStack = this.buildNestedStack(currentAction);            
                nestedStack.run();
            } else 
                this.runAction(currentAction);
        } else 
            this.onStackComplete === null || this.onStackComplete(this);
    }



    /*
     *  runAction
     */
    private runAction(action: Action): void {
        try {

            if (this.onBeforeAction != null)
                for (var i = 0; i < this.rootStack.onBeforeAction.length(); i++)
                    this.rootStack.onBeforeAction.get(i)(action, this.stack);

            action.runAction === null || action.runAction(action, this.chain);
                              
            if (this.onActionSuccess != null)
                for (var i = 0; i < this.rootStack.onActionSuccess.length(); i++)
                    this.rootStack.onActionSuccess.get(i)(action, this.stack);

            this.run();      
        } catch (err) {
            if (this.onError != null)
                for (var i = 0; i < this.rootStack.onError.length(); i++)
                    this.rootStack.onError.get(i)(err, action, this.stack);
        }
    }




    /*
     *  buildNestedStack
     */ 
    private buildNestedStack(action: Action): ActionStack {
        var nestedStack : ActionStack = new ActionStack();
        nestedStack.parentStack = this;
        nestedStack.rootStack   = this.rootStack;
        nestedStack.chain.push(action);

        nestedStack.onStackComplete = 
            function(stack: ActionStack): void {
                stack.parentStack.run();
            }

        this.chain.push(action);
 
        this.fillStack(nestedStack, action.postActions);
        
        nestedStack.putOnStack(action); 

        this.fillStack(nestedStack, action.preActions);

        return nestedStack;
    }



    /*
     *  fillStack
     */ 
    private fillStack(stack: ActionStack, actions: Array<Action>): void {
        var action = null;
        if (actions != null)            
            while ((action = actions.shift()) != null) {
                stack.putOnStack(action);
            }
    }
}