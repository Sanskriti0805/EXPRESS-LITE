import { express } from "../../lib/express";
import type Application from "../../lib/application"; 
// import type Request from "../../dist/request";
// import type Response from "../../dist/response";

// const input = {
//   args: [3000],
//   errorHandler: (error: Error, _req: Request, res: Response) => {
//     console.error("Error found");
//     res.send(error.message, 500);
//   },
// };

const app: Application = express(); // Type assertion for clarity
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  console.log(req.url);
  res.send("Hello, World!");
});
