import { IncomingMessage } from "http";
import accepts from "accepts";
import Response from "./response";
import fresh from 'fresh';

const reqPrototype: typeof IncomingMessage = Object.create(
	IncomingMessage.prototype,
);

export default class Request extends reqPrototype {
	res: Response
	body: any;
	params: any;
	query: any;

	public header(name: string) {
		const lc = name.toLowerCase();

		switch (lc) {
			case "referer":
			case "referrer":
				return this.headers.referrer || this.headers.referer;
			default:
				return this.headers[lc];
		}
	}
	accepts(name: string | Array<string>) {
		const accept = accepts(this);
		return accept.types.apply(accept, name);
	}

	get fresh(): boolean {
		const method = this.method;
		const res = this.res;

		if (!res) throw new Error("Request is missing res property");

		const status = res.statusCode;

		// GET or HEAD for weak freshness validation only
		if ("GET" !== method && "HEAD" !== method) return false;

		// 2xx or 304 as per rfc2616 14.26
		if ((status >= 200 && status < 300) || 304 === status) {
			return fresh(this.headers, {
				etag: res.get("ETag"),
				"last-modified": res.get("Last-Modified"),
			});
		}

		return false;
	}
}
