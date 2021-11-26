import express from "express";
import cors from "cors";
import { Client } from "pg";
import dotenv from "dotenv";
import filePath from "./filePath";

interface todo {
  // sketch out interface here
  text: string;
  createdAt: number;
  completed: boolean;
}

// loading in some dummy todos into the database
// (comment out if desired, or change the number)
// addDummyTodos(10);

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw "No DATABASE_URL env var!  Have you made a .env file?  And set up dotenv?";
}

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// Define client variable for making calls to the db
// Connect to the database
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const todoAPIConnection = async () => {
  await client.connect();
  console.log("Connected to todos db!");
};
todoAPIConnection();

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET all /todos
app.get("/todos", async (req, res) => {
  const getAllTodos = await client.query(
    "SELECT * FROM todos ORDER BY createdAt DESC LIMIT 50"
  );
  const todos = getAllTodos.rows;
  res.status(200).json({
    status: "success",
    todos,
  });
});

// POST /todos
app.post<{}, {}, todo>("/todos", async (req, res) => {
  const { text } = req.body;
  if (typeof text === "string") {
    const createdTodo = await client.query(
      "INSERT INTO todos VALUES (default, $1) RETURNING *",
      [text]
    );
    res.status(201).json({
      status: "success",
      newTodo: createdTodo.rows[0],
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: {
        message: "You must provide some text for your todo.",
      },
    });
  }
});

// GET /todos/:id
app.get<{ id: string }>("/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id); // params are always string type

  const getTodoById = await client.query(
    "SELECT * FROM todos WHERE id = ($1)",
    [id]
  );
  const todo = getTodoById.rows[0];

  if (todo) {
    res.status(200).json({
      status: "success",
      todo,
    });
  } else {
    res.status(404).json({
      status: "fail",
      data: {
        id: "Could not find a todo with that id.",
      },
    });
  }
});

// DELETE /todos/:id
app.delete<{ id: string }>("/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const getTodoById = await client.query(
    "SELECT * FROM todos WHERE id = ($1)",
    [id]
  );
  console.log(getTodoById);

  if (getTodoById) {
    const queryResult: any = await client.query(
      "DELETE FROM todos WHERE id = ($1)",
      [id]
    );
    if (queryResult.rowCount === 1) {
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(404).json({
        status: "fail",
        data: {
          id: "Something went wrong with deletion.",
        },
      });
    }
  } else {
    res.status(404).json({
      status: "fail",
      data: {
        id: "Could not find a todo with that id.",
      },
    });
  }
});

// PATCH /todos/:id
app.patch<{ id: string }, {}, Partial<todo>>("/todos/:id", async (req, res) => {
  const { text, completed } = req.body;
  const id = parseInt(req.params.id);
  if (typeof text === "string" || typeof completed === "boolean") {
    const updateResponse = await client.query(
      "UPDATE todos SET text = $2, completed = $3 WHERE id = $1 RETURNING *",
      [id, text, completed]
    );

    if (updateResponse.rowCount === 1) {
      const updatedTodo = updateResponse.rows[0];
      res.status(201).json({
        status: "success",
        data: {
          todo: updatedTodo,
        },
      });
    } else {
      res.status(404).json({
        status: "fail",
        data: {
          id: "Could not find a todo with that id.",
        },
      });
    }
  } else {
    res.status(400).json({
      status: "fail",
      data: {
        name: "You must provide some text for your todo.",
      },
    });
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
