import { TMethods } from "../types";
import Response from "../response";
import request from "../request";
import { pathToRegexp } from "path-to-regexp";

class Route {
  public path: string;
  public methods: TMethods | TMethods[];
  private regexp: RegExp | null = null;

  constructor(path: string, methods: TMethods | TMethods[], public callfunc: Function) {
    this.path = path;
    this.methods = methods;
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

  async dispatch(req: request): Promise<Response> {
    try {
      const res = await this.callfunc(req);

      if (!(res instanceof Response)) {
        throw new Error("callfunc must return a Response object");
      }

      return res;
    } catch (error) {
      console.error("Error in route dispatch:", error);
      
      // Pass `req` to the Response constructor
      return new Response(req, 500, { message: "Internal Server Error" });
    }
  }

  match(pathToMatch: string): boolean {
    if (!this.regexp) {
      this.regexp = pathToRegexp(this.path);
    }

    const match = newFunction().exec(pathToMatch);
    return !!match;

    function newFunction(this: any) {
      return this.regexp;
    }
  }

  static registers(router: any) {
    const methods: TMethods[] = ['GET', 'POST', 'PUT', 'DELETE', 'ALL'] as TMethods[];
    methods.forEach((method) => {
      router[method.toLowerCase()] = function (path: string, callfunc: Function) {
        router.routes.push(new Route(path, method, callfunc));
      };
    });
  }
}

export default Route;
