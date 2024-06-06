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
var send_1 = require("send");
var statuses_1 = require("statuses");
var util_1 = require("./util");
var charsetRegExp = /;\s*charset\s*=/;
var Response = /** @class */ (function (_super) {
    __extends(Response, _super);
    function Response(req, statusCode, body) {
        var _this = _super.call(this, req) || this;
        _this.send = function (body, statusCode) {
            var chunk = body;
            var encoding;
            var req = _this.req;
            var type;
            if (typeof chunk === "number" && statusCode === undefined) {
                if (!_this.get("Content-Type")) {
                    _this.type("txt");
                }
                console.warn("res.send(status): Use res.sendStatus(status) instead");
                _this.statusCode = chunk;
                chunk = statuses_1.default.message[chunk];
            }
            switch (typeof chunk) {
                case "string":
                    if (!_this.get("Content-Type")) {
                        _this.type("html");
                    }
                    break;
                case "boolean":
                case "number":
                case "object":
                    if (chunk === null) {
                        chunk = "";
                    }
                    else if (Buffer.isBuffer(chunk)) {
                        if (!_this.get("Content-Type")) {
                            _this.type("bin");
                        }
                    }
                    else {
                        return _this.json(chunk);
                    }
                    break;
            }
            if (typeof chunk === "string") {
                encoding = "utf8";
                type = _this.get("Content-Type");
                if (typeof type === "string") {
                    _this.set("Content-Type", (0, util_1.setCharset)(type, "utf-8"));
                }
            }
            var len;
            if (chunk !== undefined) {
                if (Buffer.isBuffer(chunk)) {
                    len = chunk.length;
                }
                else {
                    chunk = Buffer.from(chunk, encoding);
                    encoding = undefined;
                    len = chunk.length;
                }
                _this.set("Content-Length", len);
            }
            if (req.fresh)
                _this.statusCode = 304;
            if (204 === _this.statusCode || 304 === _this.statusCode) {
                _this.removeHeader("Content-Type");
                _this.removeHeader("Content-Length");
                _this.removeHeader("Transfer-Encoding");
                chunk = "";
            }
            if (_this.statusCode === 205) {
                _this.set("Content-Length", "0");
                _this.removeHeader("Transfer-Encoding");
                chunk = "";
            }
            if (req.method === "HEAD") {
                _this.end();
            }
            else {
                _this.end(chunk, encoding);
            }
            return _this;
        };
        _this.contentType = function (type) {
            var ct = type.indexOf("/") === -1 ? send_1.mime.lookup(type) : type;
            return _this.set("Content-Type", ct);
        };
        _this.json = function (body, status) {
            var val = body;
            if (status) {
                console.warn("res.json(obj, status): Use res.status(status).json(obj) instead");
                _this.statusCode = status;
            }
            var resBody = JSON.stringify(val);
            if (!_this.get("Content-Type")) {
                _this.set("Content-Type", "application/json");
            }
            return _this.send(resBody);
        };
        _this.req = req;
        _this.statusCode = statusCode;
        _this.body = body;
        return _this;
    }
    Response.prototype.get = function (field) {
        return this.getHeader(field);
    };
    Response.prototype.type = function (type) {
        return this.contentType(type);
    };
    Response.prototype.set = function (field, val) {
        if (field && val) {
            var value = Array.isArray(val) ? val.map(String) : String(val);
            if (field.toLowerCase() === "content-type") {
                if (Array.isArray(value)) {
                    throw new TypeError("Content-Type cannot be set to an Array");
                }
                if (!charsetRegExp.test(value)) {
                    var charset = send_1.mime.charsets.lookup(value.split(";")[0], "");
                    if (charset)
                        value += "; charset=".concat(charset.toLowerCase());
                }
            }
            this.setHeader(field, value);
        }
        else {
            for (var key in field) {
                this.set(key, field[key]);
            }
        }
        return this;
    };
    return Response;
}(http_1.ServerResponse));
exports.default = Response;
