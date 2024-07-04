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

app.get("/", (req, res) => {
  console.log(req.url);
  res.send("Hello, World!");
});

app.post("/users", (req, res) => {
  const UserData = req.body;
  console.log("Received data:", UserData);
  res.send("User data received successfully");
});

app.put("/update/:id", (req, res) => {
  const UserId = req.params.id;
  const newData = req.body;
  console.log(`Updating record with ID: ${UserId}`, newData);
  res.send(`Record with ID: ${UserId} updated successfully`);
});

app.delete("/delete/:id", (req, res) => {
  const UserId = req.params.id;
  console.log(`Deleting record with ID: ${UserId}`);
  res.send(`Record with ID: ${UserId} deleted successfully`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
