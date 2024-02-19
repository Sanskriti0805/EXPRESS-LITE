"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
var Route = /** @class */ (function () {
    function Route() {
    }
    return Route;
}());
exports.Route = Route;
var express_1 = require("express");
var router = (0, express_1.Router)();
router.get('/', function (req, res) {
    res.send('Hello World!');
});
router.get('/users', function (req, res) {
    res.send('List of users');
});
router.post('/users', function (req, res) {
    res.send('Create a new user');
});
router.get('/users/:id', function (req, res) {
    res.send("User: ".concat(req.params.id));
});
exports.default = router;
