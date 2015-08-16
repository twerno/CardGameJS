
interface IStackError { (error: Error, action: Action, actionChain: Array<Action>): void; }

interface IStackAction { (action: Action): void; }

interface IStackOnAction { (action: Action, actionChain: Array<Action>): void; }

interface IStackComplete { (stack: ActionStack): void; }


class ActionStack {

    private isCompleted : boolean = true;

    private stack : Array<Action> = [];

    chain : Array<Action> = [];
    
    parentStack : ActionStack = null;
    
    private rootStack : ActionStack = this; 
    
    onError : Collections.List<IStackError> = new Collections.List<IStackError>();

    onActionSuccess : Collections.List<IStackOnAction> = new Collections.List<IStackOnAction>();

    onStackComplete : IStackComplete = null; // Collections.List<IStackComplete> = new Collections.List<IStackComplete>();

    onBeforeAction : Collections.List<IStackOnAction> = new Collections.List<IStackOnAction>();

    onPutActionOnStack : IStackAction = null; 


    /*
     *  putOnStack
     */ 
    putOnStack(action:Action): void {
        this.stack.push(action);
        this.isCompleted = false;
        this.rootStack.onPutActionOnStack === null || this.rootStack.onPutActionOnStack(action);
    }



    /*
     *  run
     */ 
    run(): void {
        var currentAction: Action = this.stack.shift() || null;

        if (currentAction != null) {
            if (currentAction.isComplex()) {
                var nestedStack : ActionStack = this.buildNestedStack(currentAction);            
                nestedStack.run();
            } else 
                this.runAction(currentAction);
        } else if (!this.isCompleted && this.onStackComplete === null) {
            this.isCompleted = true;
            this.onStackComplete(this);
        }
    }



    /*
     *  runAction
     */
    private runAction(action: Action): void {
        try {
            var _chain : Array<Action> = this.chain[this.chain.length -1] === action ? this.chain.slice(0, -1) : this.chain;

            if (this.onBeforeAction != null)
                for (var i = 0; i < this.rootStack.onBeforeAction.length(); i++)
                    this.rootStack.onBeforeAction.get(i)(action, _chain);

            //action.runAction === null || action.runAction(action, this.chain);
            this.runAction2(action, _chain);
                              
            if (this.onActionSuccess != null)
                for (var i = 0; i < this.rootStack.onActionSuccess.length(); i++)
                    this.rootStack.onActionSuccess.get(i)(action, _chain);

            this.run();      
        } catch (err) {
            if (this.onError != null)
                for (var i = 0; i < this.rootStack.onError.length(); i++)
                    this.rootStack.onError.get(i)(err, action, _chain);
        }
    }

    /*
     *  runAction
     */
    private runAction2(action: Action, _chain: Array<Action>): void {
        if (action.runAction != null) { 
            
            action.runAction(action, _chain);
        } else {
            this.fillStack(this, action.preActions);
            this.fillStack(this, action.postActions);
            this.run();
        }
    }


    /*
     *  buildNestedStack
     */ 
    private buildNestedStack(action: Action): ActionStack {
        var nestedStack : ActionStack = new ActionStack();
        nestedStack.parentStack = this;
        nestedStack.rootStack   = this.rootStack;
        nestedStack.chain       = this.chain.slice(0);
        nestedStack.chain.push(action);

        nestedStack.onStackComplete = 
            function(stack: ActionStack): void {
                stack.parentStack.run();
            }

        this.fillStack(nestedStack, action.preActions);
        
        nestedStack.putOnStack(action); 

        this.fillStack(nestedStack, action.postActions);

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