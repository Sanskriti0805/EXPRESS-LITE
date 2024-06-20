import Application from "./Application";
import Request from "./request"; 
import Response from "./response";

function errorHandler(error: Error, _req: Request, res: Response) {
  console.error("Error:", error); 
  res.status(500).send({ message: "Internal Server Error" }); 
}

class ExpressServer { 
  private app: Application;

  constructor() {
    this.app = Application.getInstance({
      errorHandler, 
      args: [3000], 
    });
  }

  public get(path: string, callback: (req: Request, res: Response) => void) {
    this.app.get(path, callback); 
  }

  public post(path: string, callback: (req: Request, res: Response) => void) {
    this.app.post(path, callback);
  }

  public put(path: string, callback: (req: Request, res: Response) => void) {
    this.app.put(path, callback); 
  }

    public start() {
    this.app.listen(); 
}
}
const server = new ExpressServer();
// Example PUT route 
server.put("/data", (req, res) => {
  
 const data = req.body;
 console.log("Received data in PUT request:", data);

 res.send("Data received successfully!");
});

server.start();
