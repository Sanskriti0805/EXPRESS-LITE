import { Request, Response } from 'express';
class Route {
  get: any;
  dispatch: any;
  constructor(
    public method: string,
    public path: string,
    public callback: (req: Request, res: Response) => void
  ) {}
}
export class Router {
  private routes: Route[] = [];

  get(path: string, callback: (req: Request, res: Response) => Promise<void> | void) {
    this.routes.push(new Route('GET', path, callback));
  }

  post(path: string, callback: (req: Request, res: Response) => Promise<void> | void) {
    this.routes.push(new Route('POST', path, callback));
  }

  put(path: string, callback: (req: Request, res: Response) => Promise<void> | void) {
    this.routes.push(new Route('PUT', path, callback));
  }

  delete(path: string, callback: (req: Request, res: Response) => Promise<void> | void) {
    this.routes.push(new Route('DELETE', path, callback));
  }

  private handle_request(req: Request, res: Response) {
    const { method, url } = req;

    for (const route of this.routes) {
      if (route.method === method && route.path === url) {
        route.dispatch(req, res);
        return;
      }
    }

    // If no route matches, send a 404 response
    res.status(404).send('Not found');
  }

  route(path: string) {
    return new Route('', path, () => {});
  }

  handle(req: Request, res: Response, errorHandler: Function) {
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
  .get((req, res) => {
    // Handle GET /users
    res.send('GET /users');
  })
  .post((req, res) => {
    // Handle POST /users
    res.send('POST /users');
  })
  .put((req, res) => {
    // Handle PUT /users
    res.send('PUT /users');
  })
  .delete((req, res) => {
    // Handle DELETE /users
    res.send('DELETE /users');
  });

router.handle({ url: '/users', method: 'GET' } as Request, {} as Response, (err) => {
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