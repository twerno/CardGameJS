
interface IStackError { (stack: ActionStack, action: Action, actionChain: Array<Action>, error: Error): void; }

interface IStackAction { (stack: ActionStack, action: Action): void; }

interface IStackOnAction { (stack: ActionStack, action: Action, actionChain: Array<Action>): void; }

interface IStackComplete { (stack: ActionStack): void; }


class ActionStack {

    numerator : number = 0;

    id : string = this.numerator.toString();

    private isCompleted : boolean = true;

    private stack : Array<Action> = [];

    chain : Array<Action> = [];
    
    parent : ActionStack = null;
    
    private root : ActionStack = this; 
    
    stackChain : Array<ActionStack> = [];



    onError : Collections.List<IStackError> = new Collections.List<IStackError>();

    onActionSuccess : Collections.List<IStackOnAction> = new Collections.List<IStackOnAction>();

    onStackComplete : IStackComplete = null;

    private internalOnStackComplete : IStackComplete = null;

    onBeforeAction : Collections.List<IStackOnAction> = new Collections.List<IStackOnAction>();

    onPutActionOnStack : IStackAction = null;


    /*
     *  putOnStack
     */ 
    putOnStack(action:Action): void {
        this.stack.push(action);
        this.isCompleted = false;
        this.root.onPutActionOnStack === null || this.root.onPutActionOnStack(this, action);
    }



    /*
     *  run
     */ 
    run(): void {
        var currentAction: Action = this.stack.shift() || null;

        if (currentAction != null) {
            if (currentAction.isComplex()) {
                var nestedStack : ActionStack = this.buildNestedStack(currentAction);
                this.root.stackChain.push(nestedStack);            
                nestedStack.run();
            } else 
                this.runAction(currentAction);
        } else if (!this.isCompleted && this.root.onStackComplete != null) {
            this.isCompleted = true;
            this.root.onStackComplete === null || this.root.onStackComplete(this);
            this.internalOnStackComplete === null || this.internalOnStackComplete(this);
        }
    }



    /*
     *  runAction
     */
    private runAction(action: Action): void {
        try {
            var _chain : Array<Action> = this.chain[this.chain.length -1] === action ? this.chain.slice(0, -1) : this.chain;

            if (this.onBeforeAction != null)
                for (var i = 0; i < this.root.onBeforeAction.length(); i++)
                    this.root.onBeforeAction.get(i)(this, action, _chain);

            //action.runAction === null || action.runAction(action, this.chain);
            this.runAction2(action, _chain);
                              
            if (this.onActionSuccess != null)
                for (var i = 0; i < this.root.onActionSuccess.length(); i++)
                    this.root.onActionSuccess.get(i)(this, action, _chain);

            this.run();      
        } catch (err) {
            if (this.onError != null)
                for (var i = 0; i < this.root.onError.length(); i++)
                    this.root.onError.get(i)(this, action, _chain, err);
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
        nestedStack.parent = this;
        nestedStack.root   = this.root;
        nestedStack.chain       = this.chain.slice(0);
        nestedStack.chain.push(action);
        nestedStack.id = (++this.root.numerator).toString();

        nestedStack.internalOnStackComplete = 
            function(stack: ActionStack): void {
                stack.root.stackChain.pop();
                stack.parent.run();
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