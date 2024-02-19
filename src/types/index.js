"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TMethods = void 0;
var TMethods;
(function (TMethods) {
    TMethods["GET"] = "GET";
    TMethods["POST"] = "POST";
    TMethods["DELETE"] = "DELETE";
    TMethods["PUT"] = "PUT";
})(TMethods || (exports.TMethods = TMethods = {}));
var express_1 = require("express");
var router_1 = require("./router");
var app = (0, express_1.default)();
var port = 3000;
app.use('/api', router_1.default);
app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(3000));
});
