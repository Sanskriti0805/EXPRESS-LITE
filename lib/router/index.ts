import { TMethods } from "../types";
import type Request from "../request";
import type Response from "../response";
import Route from "./route";
export class Router {
  private routes: Route[] = [];

  get(path: string,
     callback: (req: Request, res: Response) => Promise<void> | void) {
    this.routes.push(new Route(path, [TMethods.GET] ,callback));

  }

  post(path: string,
     callback: (req: Request, res: Response) => Promise<void> | void) {
    this.routes.push(new Route(path, [TMethods.POST], callback));
  }

  put(path: string,
     callback: (req: Request, res: Response) => Promise<void> | void) {
    this.routes.push(new Route( path, [TMethods.PUT], callback));
  }

  delete(path: string, callback: (req: Request, res: Response) => Promise<void> | void) {
    this.routes.push(new Route( path, [TMethods.DELETE], callback));
  }

  private handle_request(req: Request, res: Response) {
    const { method, url } = req;

    for (const route of this.routes) {
      if (route.handlesMethod(method) && route.match(url ?? "/")) {
        route.dispatch(req, res);
        return;
      }
    }

    // If no route matches, send a 404 response
    res.status(404).send('Not found');
  }

  route(path: string) {
    return new Route(path, [TMethods.GET], () => {});
  }

  handle(
    req: Request,
    res: Response, 
    errorHandler:(error:Error, req: Request, res: Response)=>void,
  )
     {
    try {
      this.handle_request(req, res);
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}

// Example 
const router = new Router();

router
  .route('/users')
  .get((_req, res) => {
    // Handle GET /users
    res.send('GET /users');
    
  })
 .post((_req, res) => {
    // Handle POST /users
    res.send('POST /users');
   
  })
  .put((_req, res) => {
    // Handle PUT /users
    res.send('PUT /users');
  })
  .delete((_req, res) => {
    // Handle DELETE /users
    res.send('DELETE /users');
  });

router.handle({ url: '/users', method: 'POST' } as Request, {} as Response, (err) => {
    console.error(err);
  });
  
router.handle({ url: '/users', method: 'POST' } as Request, {} as Response, (err) => {
  console.error(err);
});

router.handle({ url: '/users', method: 'PUT' } as Request, {} as Response, (err) => {
  console.error(err);
});

router.handle({ url: '/users', method: 'DELETE' } as Request, {} as Response, (err) => {
  console.error(err);
});
