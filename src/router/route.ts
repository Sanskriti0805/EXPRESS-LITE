import { TMethods } from "../types";
import Response from "../response";
import request from "../request";
import { pathToRegexp } from "path-to-regexp";

class Route {
  get(_arg0: (_req: any, res: any) => void) {
    throw new Error("Method not implemented.");
  }
  public path: string;
  public methods: TMethods | TMethods[];
  private regexp: RegExp | null = null;

  constructor(path: string, methods: TMethods | TMethods[], public callfunc: Function) {
    this.path = path;
    this.methods = methods;
    this.regexp = pathToRegexp(this.path);
  }

  handlesMethod(method?: string): boolean {
    if (!method) {
      return false;
    }

    method = method.toUpperCase();

    if (typeof this.methods === 'string') {
      return this.methods.toUpperCase() === method;
    }

    return this.methods.includes(method as TMethods);
  }

  options(): TMethods[] {
    if (typeof this.methods === 'string') {
      return [this.methods.toUpperCase() as TMethods];
    }
    return this.methods.map((method) => method.toUpperCase() as TMethods);
  }

  async dispatch(req: request,res: Response) {
    try {
       this.callfunc(req,res); 
    } catch (error) {
      console.error("Error in route dispatch:", error);
      
     res.send(JSON.stringify({ message: "Internal Server Error" }), 500);
    }
  }

  match(pathToMatch: string): boolean {
    if (!this.regexp) {
      return false;
    }

    const match = this.regexp.exec(pathToMatch);
    return !!match;
  }
}

export default Route;