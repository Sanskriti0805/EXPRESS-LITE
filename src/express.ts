import Application  from "./Application";
import Request from "./request";
import Response from "./response";

function errorHandler(error: Error, req: Request, res: Response) {


}

function start() {
    Application.getInstance({
        errorHandler,
        args: [3000],
    })
}

start();