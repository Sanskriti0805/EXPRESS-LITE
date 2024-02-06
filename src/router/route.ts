
import { TMethods } from "src/types";

type GenericFunction = (...args: any[]) => any;

export class Route {
	path: string;
	method: TMethods;
	callBackFunction: GenericFunction;
}
