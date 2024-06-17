import { Server } from "http";
import type Request from "./request";
import type Response from "./response";
import  {Router}  from "./router";
import http from "http";
import type net from "net";

class Application extends Server {
    private static instance: Application;
    private router: Router ; 
    private errorHandler: (error: Error, req: Request, res: Response) => void;
  
    static getInstance(input: {
      errorHandler?: (error: Error, req: Request, res: Response) => void;
      args?: unknown[];
    }) {
      if (!Application.instance) {
        Application.instance = new Application();
        Application.instance.listen(input.args);
        if (input.errorHandler) {
          Application.instance.errorHandler = input.errorHandler;
        }
      }
      return Application.instance;
    }
  
    listen(...args: any[]) {
      const server = http.createServer(this);
      server.addListener("request", this.handler.bind(this));
      return server.listen.apply(server, args);
    }
  
    handler(req: Request, res: Response) {
      const errorHandler = this.errorHandler || this.defaultErrorHandler;
      const router = this.router ?? new Router(); // Use nullish coalescing operator
      router.handle(req, res, errorHandler);
    }
  
    defaultErrorHandler(error: Error, req: Request, res: Response) {
      console.error("Error in route dispatch:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  
    private lazyRouter() {
      if (!this.router) {
        this.router = new Router();
      }
    }
  
    public get(path: string, callback: (req: Request, res: Response) => void) {
      this.lazyRouter(); // Ensure router is initialized before adding route
      this.router.get(path, callback);
    }
  
    public put(path: string, callback: (req: Request, res: Response) => void) {
      this.lazyRouter();
      this.router.put(path, callback);
    }
  
    public delete(path: string, callback: (req: Request, res: Response) => void) {
      this.lazyRouter();
      this.router.delete(path, callback);
    }
  
    public post(path: string, callback: (req: Request, res: Response) => void) {
      this.lazyRouter();
      this.router.post(path, callback);
    }
  }
  
  export default Application;
  