import { Server } from "http";
import type Request from "./request";
import Response from "./response";
import { Router } from "./router";
import http from "http";
import type net from "net";

class Application extends Server {
  private static instance: Application;
  private router: Router;
  private errorHandler: (error: Error, req: Request, res: Response) => void;

  static getInstance(input: {
    errorHandler?: (error: Error, req: Request, res: Response) => void;
     }) {
    if (!Application.instance) {
      Application.instance = new Application();
      
      if (input.errorHandler) {
        Application.instance.errorHandler = input.errorHandler;
      }
    }
    return Application.instance;
  }
  listen(
    port?: number,
    hostname?: string,
    backlog?: number,
    listeningListener?: () => void,
  ): this;
  listen(
    port?: number,
    hostname?: string,
    listeningListener?: () => void,
  ): this;
  listen(port?: number, backlog?: number, listeningListener?: () => void): this;
  listen(port?: number, listeningListener?: () => void): this;
  listen(path: string, backlog?: number, listeningListener?: () => void): this;
  listen(path: string, listeningListener?: () => void): this;
  listen(options: net.ListenOptions, listeningListener?: () => void): this;
  listen(handle: any, backlog?: number, listeningListener?: () => void): this;
  listen(handle: any, listeningListener?: () => void): this;
  listen(...args: any[]) {
    const server = http.createServer(this);
    server.addListener("request", this.handler.bind(this));
    return server.listen.apply(server, args);
  }

  handler(req: Request, res: Response) {
    const errorHandler = this.errorHandler || this.defaultErrorHandler;
    const router = this.router ?? new Router();
    Response.extend(res);
    router.handle(req, res, errorHandler);
  }

  defaultErrorHandler(error: Error, _req: Request, res: Response) {
    console.error("Error in route dispatch:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }

  private lazyRouter() {
    if (!this.router) {
      this.router = new Router();
    }
  }

  public get(path: string, callback: (req: Request, res: Response) => void) {
    this.lazyRouter(); // Ensuring router is initialized before adding route
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
