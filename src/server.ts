import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  addDummyTodos,
  addTodo,
  getAllTodos,
  getTodoById,
  todo,
  updateTodoById,
} from "./db";
import filePath from "./filePath";

// loading in some dummy todos into the database
// (comment out if desired, or change the number)
addDummyTodos(20);

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET /todos
app.get("/todos", (req, res) => {
  const allSignatures = getAllTodos();
  res.status(200).json(allSignatures);
});

// POST /todos
app.post<{}, {}, todo>("/todos", (req, res) => {
  // to be rigorous, ought to handle non-conforming request bodies
  // ... but omitting this as a simplification
  const postData = req.body;
  const createdSignature = addTodo(postData);
  res.status(201).json(createdSignature);
});

// GET /todos/:id
app.get<{ id: string }>("/todos/:id", (req, res) => {
  const matchingSignature = getTodoById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

// DELETE /todos/:id
app.delete<{ id: string }>("/todos/:id", (req, res) => {
  const matchingSignature = getTodoById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

// PATCH /todos/:id
app.patch<{ id: string }, {}, Partial<todo>>("/todos/:id", (req, res) => {
  const matchingSignature = updateTodoById(parseInt(req.params.id), req.body);
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
