"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCharset = void 0;
var content_type_1 = require("content-type");
function setCharset(type, charset) {
    if (!type || !charset) {
        return type;
    }
    // parse type
    var parsed = content_type_1.default.parse(type);
    // set charset
    parsed.parameters.charset = charset;
    // format type
    return content_type_1.default.format(parsed);
}
exports.setCharset = setCharset;
;
