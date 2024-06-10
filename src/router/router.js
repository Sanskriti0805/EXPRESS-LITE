"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var Router = /** @class */ (function () {
    function Router() {
        this.routes = [];
    }
    Router.prototype.get = function (path, callback) {
        this.routes.push(new Route('GET', path, callback));
    };
    Router.prototype.post = function (path, callback) {
        this.routes.push(new Route('POST', path, callback));
    };
    Router.prototype.put = function (path, callback) {
        this.routes.push(new Route('PUT', path, callback));
    };
    Router.prototype.delete = function (path, callback) {
        this.routes.push(new Route('DELETE', path, callback));
    };
    Router.prototype.handle_request = function (req, res) {
        var method = req.method, url = req.url;
        for (var _i = 0, _a = this.routes; _i < _a.length; _i++) {
            var route = _a[_i];
            if (route.method === method && route.path === url) {
                route.callback(req, res);
                return;
            }
        }
        // If no route matches, send a 404 response
        res.status(404).send('Not found');
    };
    Router.prototype.route = function (path) {
        return new Route('', path, function () { });
    };
    Router.prototype.handle = function (req, res, errorHandler) {
        try {
            this.handle_request(req, res);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    };
    return Router;
}());
exports.Router = Router;
var Route = /** @class */ (function () {
    function Route(method, path, callback) {
        this.method = method;
        this.path = path;
        this.callback = callback;
    }
    return Route;
}());
// Example 
var router = new Router();
router
    .route('/users')
    .get(function (req, res) {
    // Handle GET /users
    res.send('GET /users');
})
    .post(function (req, res) {
    // Handle POST /users
    res.send('POST /users');
})
    .put(function (req, res) {
    // Handle PUT /users
    res.send('PUT /users');
})
    .delete(function (req, res) {
    // Handle DELETE /users
    res.send('DELETE /users');
});
router.handle({ url: '/users', method: 'GET' }, {}, function (err) {
    console.error(err);
});
router.handle({ url: '/users', method: 'POST' }, {}, function (err) {
    console.error(err);
});
router.handle({ url: '/users', method: 'PUT' }, {}, function (err) {
    console.error(err);
});
router.handle({ url: '/users', method: 'DELETE' }, {}, function (err) {
    console.error(err);
});
