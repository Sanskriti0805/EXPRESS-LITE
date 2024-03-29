import { ServerResponse } from "http";
import { mime } from "send";
import statuses from "statuses";
import { setCharset } from "./util";
import Request from './request'

const resPrototype: typeof ServerResponse = Object.create(
	ServerResponse.prototype,
);

const charsetRegExp = /;\s*charset\s*=/;

export default class Response extends resPrototype {
  req: Request;
  statusCode: number;

	send = (body?: any, statusCode?: number) => {
		let chunk = body;
		let encoding;
		const req = this.req;
		let type;

		// disambiguate res.send(status) and res.send(status, num)
		if (typeof chunk === "number" && statusCode === undefined) {
			// res.send(status) will set status message as text string
			if (!this.get("Content-Type")) {
				this.type("txt");
			}

			console.warn("res.send(status): Use res.sendStatus(status) instead");
			this.statusCode = chunk;
			chunk = statuses.message[chunk];
		}

		switch (typeof chunk) {
			// string defaulting to html
			case "string":
				if (!this.get("Content-Type")) {
					this.type("html");
				}
				break;
			case "boolean":
			case "number":
			case "object":
				if (chunk === null) {
					chunk = "";
				} else if (Buffer.isBuffer(chunk)) {
					if (!this.get("Content-Type")) {
						this.type("bin");
					}
				} else {
					return this.json(chunk);
				}
				break;
		}

		// write strings in utf-8
		if (typeof chunk === "string") {
			encoding = "utf8";
			type = this.get("Content-Type");

			// reflect this in content-type
			if (typeof type === "string") {
				this.set("Content-Type", setCharset(type, "utf-8"));
			}
		}

		// determine if ETag should be generated

		// populate Content-Length
		let len;
		if (chunk !== undefined) {
			if (Buffer.isBuffer(chunk)) {
				// get length of Buffer
				len = chunk.length;
			} else {
				// convert chunk to Buffer and calculate
				chunk = Buffer.from(chunk, encoding as BufferEncoding);
				encoding = undefined;
				len = chunk.length;
			}

			this.set("Content-Length", len);
		}

		// freshness
		if (req.fresh) this.statusCode = 304;

		// strip irrelevant headers
		if (204 === this.statusCode || 304 === this.statusCode) {
			this.removeHeader("Content-Type");
			this.removeHeader("Content-Length");
			this.removeHeader("Transfer-Encoding");
			chunk = "";
		}

		// alter headers for 205
		if (this.statusCode === 205) {
			this.set("Content-Length", "0");
			this.removeHeader("Transfer-Encoding");
			chunk = "";
		}

		if (req.method === "HEAD") {
			// skip body for HEAD
			this.end();
		} else {
			// respond
			this.end(chunk, encoding as BufferEncoding);
		}

		return this;
	};

	get(field: string): string | number | string[] | undefined {
		return this.getHeader(field);
	}

	type(type: string): this {
		return this.contentType(type);
	}

	contentType = (type: string): this => {
		const ct = type.indexOf("/") === -1 ? mime.lookup(type) : type;

		return this.set("Content-Type", ct);
	};

	set(field: any): this;
	set(field: string, value?: string | string[] | undefined): this;
	set(field: any, val?: string | string[]): this {
		if (field && val) {
			let value = Array.isArray(val) ? val.map(String) : String(val);

			// add charset to content-type
			if (field.toLowerCase() === "content-type") {
				if (Array.isArray(value)) {
					throw new TypeError("Content-Type cannot be set to an Array");
				}
				if (!charsetRegExp.test(value)) {
					// @TODO: Fix mime fallback types
					const charset = mime.charsets.lookup(value.split(";")[0], "");
					if (charset) value += `; charset=${charset.toLowerCase()}`;
				}
			}

			this.setHeader(field, value);
		} else {
			for (const key in field) {
				this.set(key, field[key]);
			}
		}
		return this;
	}

	json = (body?: any, status?: number): this => {
		const val = body;

		// allow status / body
		if (status) {
			console.warn(
				"res.json(obj, status): Use res.status(status).json(obj) instead",
			);
			this.statusCode = status;
		}

		const resBody = JSON.stringify(val);

		// content-type
		if (!this.get("Content-Type")) {
			this.set("Content-Type", "application/json");
		}

		return this.send(resBody);
	};
}
