import express from "express";

const app = express();
const myRouter = require('./router/Router');

// Use the router for a specific path
app.use('/api', myRouter);

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});