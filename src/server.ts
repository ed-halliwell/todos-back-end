import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  addDummyTodos,
  addTodo,
  deleteTodoById,
  getAllTodos,
  getTodoById,
  todo,
  updateTodoById,
} from "./db";
import filePath from "./filePath";

// loading in some dummy todos into the database
// (comment out if desired, or change the number)
addDummyTodos(10);

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
  const { text, createdAt, completed } = req.body;
  if (text) {
    const createdSignature = addTodo({
      text,
      createdAt,
      completed,
    });
    res.status(201).json(createdSignature);
  } else {
    res.status(400).json({
      errorMessage: "You must provide some text for your todo.",
    });
  }
});

// GET /todos/:id
app.get<{ id: string }>("/todos/:id", (req, res) => {
  const matchingTodo = getTodoById(parseInt(req.params.id));
  if (matchingTodo === "Not found") {
    res.status(404).json(matchingTodo);
  } else {
    res.status(200).json(matchingTodo);
  }
});

// DELETE /todos/:id
app.delete<{ id: string }>("/todos/:id", (req, res) => {
  const matchingTodo = getTodoById(parseInt(req.params.id));
  if (matchingTodo === "Not found") {
    res.status(404).json({
      status: "fail",
      message: "No todo found with that ID.",
    });
  } else {
    const didRemove = deleteTodoById(matchingTodo.id);
    res.status(200).json({
      status: "success",
      data: { didRemove },
    });
  }
});

// PATCH /todos/:id
app.patch<{ id: string }, {}, Partial<todo>>("/todos/:id", (req, res) => {
  const matchingTodo = getTodoById(parseInt(req.params.id));
  if (matchingTodo === "Not found") {
    res.status(404).json({
      status: "fail",
      message: "No todo found with that ID.",
    });
  } else {
    const didUpdate = updateTodoById(parseInt(req.params.id), req.body);
    res.status(201).json({
      status: "success",
      data: { didUpdate },
    });
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
