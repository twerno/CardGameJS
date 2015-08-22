///<reference path="Action.ts"/>
///<reference path="Task.ts"/>


class GetARandomNumberActionResult implements ITaskResult {
    task_state: TaskState = TaskState.SUCCESS;
    randomNumbers: Array<number>;
}

class GetARandomNumberAction extends Action {

    howMany : number = 1;

    result : GetARandomNumberActionResult = null;

    max : number = 10e6;
    min : number = 0;

    constructor(parent: IAction) {
        super(parent, null);
    }


    get asyncWorker() : ITaskAsyncWorker {return this.workerFn}



    private workerFn(self: GetARandomNumberAction, onSuccess: IResultCallback, onError: IErrorCallback): void {
        var result: GetARandomNumberActionResult = new GetARandomNumberActionResult();

        for (var i = 0; i < self.howMany; i++) {
            result.randomNumbers.push(Math.floor(Math.random() * (this.max - this.min + 1)) + this.min);
        }
        onSuccess(result);
        return;
    }



    applyResult(result: GetARandomNumberActionResult) : void {
        super.applyResult(result);
        this.result = result;
    }
}