import { TMethods } from "../types"; // Assuming this defines the type for HTTP methods
import Response from "../response";
import request from "../request";
import { pathToRegexp } from "path-to-regexp";

class Route {
  // Instance Variables:
  public path: string; 
  public methods: TMethods | TMethods[];  
  private regexp: RegExp | null = null; 

  // Constructor:
  constructor(
    path: string,
    methods: TMethods | TMethods[], 
    public callfunc: Function
  ) {
    this.path = path;
    this.methods = methods;
  }

  // handlesMethod:
  handlesMethod(method?: string): boolean {
    if (!method) {
      return false; // No method provided
    }

    method = method.toUpperCase(); 

    if (typeof this.methods === 'string') {
      return this.methods.toUpperCase() === method; // Handle single method
    }

    return this.methods.includes(method as TMethods); // Handle multiple methods
  }

  // options:
  options(): TMethods[] {
    if (typeof this.methods === 'string') {
      return [this.methods.toUpperCase() as TMethods]; // Single method as array
    }
    return this.methods.map((method) => method.toUpperCase() as TMethods); // Multiple methods as uppercase array
  }

  // dispatch:
  async dispatch(req: request): Promise<Response> {
    try {
      return await this.callfunc(req);
    } catch (error) {
      console.error("Error in route dispatch:", error);
      return new Response(500, { message: "Internal Server Error" });
    }
  }

  // match:
  match(pathToMatch: string): boolean {
    if (!this.regexp) { 
      this.regexp = pathToRegexp(this.path);
    }

    // Adding the null check
    if (this.regexp) {
      const match = this.regexp.exec(pathToMatch);
      return !!match; // Return true if there's a match, false otherwise
    }

    return false;
  }

  // registers: (Static method)
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
