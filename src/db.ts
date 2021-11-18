export interface todo {
  // sketch out interface here
  text: string;
  createdAt: number;
  completed: boolean;
}

export interface todoWithId extends todo {
  id: number;
}

const db: todoWithId[] = [];

/** Variable to keep incrementing id of database todos */
let idCounter = 0;

/**
 * Adds in some dummy database todos to the database
 *
 * @param n - the number of todos to generate
 * @returns the created todos
 */
export const addDummyTodos = (n: number): todoWithId[] => {
  const createdTodos: todoWithId[] = [];
  for (let count = 0; count < n; count++) {
    const createdTodo = addTodo({
      text: [
        "Feed the cat",
        "Water the plants",
        "Put the bins out",
        "Contemplate life",
        "Tidy up",
        "Walk the dog",
        "Write a todo list",
        "Book a holiday",
        "Write a shopping list",
        "Do the shopping",
      ][Math.floor(Math.random() * 10)],
      createdAt: +new Date(),
      completed: false,
    });
    createdTodos.push(createdTodo);
  }
  return createdTodos;
};

/**
 * Adds in a single todo to the database
 *
 * @param data - the todo data to insert in
 * @returns the todo added (with a newly created id)
 */
export const addTodo = (data: todo): todoWithId => {
  const { text } = data;
  const newEntry: todoWithId = {
    id: ++idCounter,
    text,
    createdAt: +new Date(),
    completed: false,
  };
  db.push(newEntry);
  return newEntry;
};

/**
 * Deletes a database todo with the given id
 *
 * @param id - the id of the database todo to delete
 * @returns the deleted database todo (if originally located),
 *  otherwise the string `"not found"`
 */
export const deleteTodoById = (id: number): todoWithId | "Not found" => {
  const idxToDeleteAt = findIndexOfTodoById(id);
  // console.log(id, idxToDeleteAt);
  if (typeof idxToDeleteAt === "number" && idxToDeleteAt >= 0) {
    const todoToDelete = getTodoById(id);
    db.splice(idxToDeleteAt, 1); // .splice can delete from an array
    return todoToDelete;
  } else {
    return "Not found";
  }
};

/**
 * Finds the index of a database todo with a given id
 *
 * @param id - the id of the database todo to locate the index of
 * @returns the index of the matching database todo,
 *  otherwise the string `"not found"`
 */
const findIndexOfTodoById = (id: number): number | "Not found" => {
  const matchingIdx = db.findIndex((entry) => entry.id === id);
  // .findIndex returns -1 if not located
  if (matchingIdx >= 0) {
    return matchingIdx;
  } else {
    return "Not found";
  }
};

/**
 * Find all database todos
 * @returns all database todos from the database
 */
export const getAllTodos = (): todoWithId[] => {
  return db;
};

/**
 * Locates a database todo by a given id
 *
 * @param id - the id of the database todo to locate
 * @returns the located database todo (if found),
 *  otherwise the string `"not found"`
 */
export const getTodoById = (id: number): todoWithId | "Not found" => {
  const maybeEntry = db.find((entry) => entry.id === id);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "Not found";
  }
};

/**
 * Applies a partial update to a database todo for a given id
 *  based on the passed data
 *
 * @param id - the id of the database todo to update
 * @param newData - the new data to overwrite
 * @returns the updated database todo (if one is located),
 *  otherwise the string `"not found"`
 */
export const updateTodoById = (
  id: number,
  newData: Partial<todo>
): todoWithId | "Not found" => {
  const idxOfEntry = findIndexOfTodoById(id);
  // type guard against "not found"
  if (typeof idxOfEntry === "number") {
    return Object.assign(db[idxOfEntry], newData);
  } else {
    return "Not found";
  }
};
