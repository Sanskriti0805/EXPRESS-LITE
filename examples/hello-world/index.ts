import { express } from "../../lib/express";
import type Application from "../../lib/application";

// Middleware for parsing JSON bodies
const app: Application = express();

app.get("/", (req, res) => {
  console.log(req.url);
  res.send("Hello, World!");
});

// POST example: To create a new user, with optional query parameters
app.post("/users", (req, res) => {
  const userData = req.body;
  const { role } = req.query; // Example of query parameter
  console.log("Received data:", userData, "with role:", role);
  res.send("User data received successfully");
});

// PUT example: Update a user by ID, with optional query parameters
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const newData = req.body;
  const { notify } = req.query; // Example of query parameter
  console.log(`Updating user with ID: ${userId}`, newData, "with notify:", notify);
  res.send(`User with ID: ${userId} updated successfully`);
});

// DELETE example: Delete a user by ID, with optional query parameters
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { softDelete } = req.query; // Example of query parameter
  console.log(`Deleting user with ID: ${userId}`, "with soft delete:", softDelete);
  res.send(`User with ID: ${userId} deleted successfully`);
});

// GET example: Fetch users with optional query parameters
app.get("/users", (req, res) => {
  const { name, age } = req.query;
  if (name || age) {
    console.log(`Fetching users with name: ${name} and age: ${age}`);
    res.send(`Fetching users with name: ${name} and age: ${age}`);
  } else {
    console.log("Fetching all users");
    res.send("Fetching all users");
  }
});

// POST example: Create a book with optional query parameters
app.post("/books", (req, res) => {
  const bookData = req.body;
  const { publisher } = req.query; // Example of query parameter
  console.log("Received book data:", bookData, "with publisher:", publisher);
  res.send("Book data received successfully");
});

// PUT example: Update a book by ID, with optional query parameters
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const newData = req.body;
  const { notify } = req.query; // Example of query parameter
  console.log(`Updating book with ID: ${bookId}`, newData, "with notify:", notify);
  res.send(`Book with ID: ${bookId} updated successfully`);
});

// DELETE example: Delete a book by ID, with optional query parameters
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const { softDelete } = req.query; // Example of query parameter
  console.log(`Deleting book with ID: ${bookId}`, "with soft delete:", softDelete);
  res.send(`Book with ID: ${bookId} deleted successfully`);
});

// GET example: Fetch books with optional query parameters
app.get("/books", (req, res) => {
  const { bookName, publisher } = req.query;
  if (bookName || publisher) {
    console.log(`Fetching books with name: ${bookName} and publisher: ${publisher}`);
    res.send(`Fetching books with name: ${bookName} and publisher: ${publisher}`);
  } else {
    console.log("Fetching all books");
    res.send("Fetching all books");
  }
});

// POST example: Create a room with optional query parameters
app.post("/rooms", (req, res) => {
  const roomData = req.body;
  const { floor } = req.query; // Example of query parameter
  console.log("Received room data:", roomData, "with floor:", floor);
  res.send("Room data received successfully");
});

// PUT example: Update a room by ID, with optional query parameters
app.put("/rooms/:id", (req, res) => {
  const roomId = req.params.id;
  const newData = req.body;
  const { notify } = req.query; // Example of query parameter
  console.log(`Updating room with ID: ${roomId}`, newData, "with notify:", notify);
  res.send(`Room with ID: ${roomId} updated successfully`);
});

// DELETE example: Delete a room by ID, with optional query parameters
app.delete("/rooms/:id", (req, res) => {
  const roomId = req.params.id;
  const { softDelete } = req.query; // Example of query parameter
  console.log(`Deleting room with ID: ${roomId}`, "with soft delete:", softDelete);
  res.send(`Room with ID: ${roomId} deleted successfully`);
});

// GET example: Fetch rooms with optional query parameters
app.get("/rooms", (req, res) => {
  const { roomId } = req.query;
  if (roomId) {
    console.log(`Fetching room with ID: ${roomId}`);
    res.send(`Fetching room with ID: ${roomId}`);
  } else {
    console.log("Fetching all rooms");
    res.send("Fetching all rooms");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
