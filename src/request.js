"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var accepts_1 = require("accepts");
var fresh_1 = require("fresh");
var reqPrototype = Object.create(http_1.IncomingMessage.prototype);
var Request = /** @class */ (function (_super) {
    __extends(Request, _super);
    function Request() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Request.prototype.header = function (name) {
        var lc = name.toLowerCase();
        switch (lc) {
            case "referer":
            case "referrer":
                return this.headers.referrer || this.headers.referer;
            default:
                return this.headers[lc];
        }
    };
    Request.prototype.accepts = function (name) {
        var accept = (0, accepts_1.default)(this);
        return accept.types.apply(accept, name);
    };
    Object.defineProperty(Request.prototype, "fresh", {
        get: function () {
            var method = this.method;
            var res = this.res;
            if (!res)
                throw new Error("Request is missing res property");
            var status = res.statusCode;
            // GET or HEAD for weak freshness validation only
            if ("GET" !== method && "HEAD" !== method)
                return false;
            // 2xx or 304 as per rfc2616 14.26
            if ((status >= 200 && status < 300) || 304 === status) {
                return (0, fresh_1.default)(this.headers, {
                    etag: res.get("ETag"),
                    "last-modified": res.get("Last-Modified"),
                });
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    return Request;
}(reqPrototype));
exports.default = Request;
