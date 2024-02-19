import { TMethods } from "src/types";
type GenericFunction = (args: any[]) => any;
export class Route {
	path: string;
	method: TMethods;
	callBackFunction: GenericFunction;}
	import { Router } from 'express';

	const router = Router();
	
	router.get('/', (_req, res) => {
	  res.send('Hello World!');
	});
	
	router.get('/users', (_req, res) => { // missing '.' before 'get'
	  res.send('List of users');
	});
	
	router.post('/users', (_req, res) => {
	  res.send('Create a new user');
	});
	
	router.get('/users/:id', (req, res) => { // missing parameter name in route path
	  res.send(`User: ${req.params.id}`);
	});
	
	export default router;


