import { express } from "../../src/express";
import type  Response  from "../../dist/response";
import type  Application  from "../../src/Application";
import type  Request  from "../../dist/request";

const input ={

    args: [3000],
    errorHandler: (error: Error, _req: Request, res: Response) => {
        console.error("Error found");
        res.send(error.message, 500);    
    } ,
};

const app: Application express(input);
app.listen(3000, () =>{
console.log("Server is running on port 3000");

});

app.get("/", (req, _res) => {
    console.log(req.url);
});


