import { TMethods } from "../types";
import Response from "../response";
import request from "../request";
import { pathToRegexp } from "path-to-regexp";

class Route {
  
  public path: string;
  public methods: { [key: string]: Function };
  private regexp: RegExp | null = null;

  constructor(path: string, methods: TMethods[], public callfunc: Function) {
    this.path = path;
    this.methods = {};
    if (methods && callfunc) {
      for (let method of methods) {
        this.methods[method.toLowerCase()] = callfunc;
      }
    }
    this.regexp = pathToRegexp(this.path);
  }

  handlesMethod(method?: string): boolean {
    if (this.methods[TMethods.ALL]) {
      return true;
    }

    if (!method) return false;

    let name = method.toLowerCase();

    if (method === "head" && !this.methods["head"]) {
      name = "get";
    }

    console.log({methods: this.methods});

    const res = this.methods[name];

    if (res) {
      console.log("Method allowed");
      return true;
    }
    else {
      console.log("Method not allowed", name);
    }

    return false;
  }

  options() {
    let methods: string[] = Object.keys(this.methods);

    if (this.methods["get"] && !this.methods["head"]) {
      methods.push("head");
    }

    for (let i = 0; i < methods.length; i++) {
      methods[i] = methods[i].toLowerCase();
    }

    return methods;
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

  get(callback: Function) {
    console.log("registering get")
    const method = TMethods.GET.toLowerCase();
    this.methods[method] = callback;
    return this
  }
  post(callback: Function) {
    this.methods[TMethods.POST] = callback;
    return this
  }
  put(callback: Function) {
    this.methods[TMethods.PUT] = callback;
    return this
  }
  delete(callback: Function) {
    this.methods[TMethods.DELETE] = callback;
    return this
  }
}

export default Route;