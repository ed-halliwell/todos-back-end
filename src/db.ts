export interface todo {
  // sketch out interface here
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
  const createdSignatures: todoWithId[] = [];
  for (let count = 0; count < n; count++) {
    const createdSignature = addTodo({
      // possibly add some generated data here
    });
    createdSignatures.push(createdSignature);
  }
  return createdSignatures;
};

/**
 * Adds in a single todo to the database
 *
 * @param data - the todo data to insert in
 * @returns the todo added (with a newly created id)
 */
export const addTodo = (data: todo): todoWithId => {
  const newEntry: todoWithId = {
    id: ++idCounter,
    ...data,
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
export const deleteTodoById = (id: number): todoWithId | "not found" => {
  const idxToDeleteAt = findIndexOfTodoById(id);
  if (typeof idxToDeleteAt === "number") {
    const todoToDelete = getTodoById(id);
    db.splice(idxToDeleteAt, 1); // .splice can delete from an array
    return todoToDelete;
  } else {
    return "not found";
  }
};

/**
 * Finds the index of a database todo with a given id
 *
 * @param id - the id of the database todo to locate the index of
 * @returns the index of the matching database todo,
 *  otherwise the string `"not found"`
 */
const findIndexOfTodoById = (id: number): number | "not found" => {
  const matchingIdx = db.findIndex((entry) => entry.id === id);
  // .findIndex returns -1 if not located
  if (matchingIdx) {
    return matchingIdx;
  } else {
    return "not found";
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
export const getTodoById = (id: number): todoWithId | "not found" => {
  const maybeEntry = db.find((entry) => entry.id === id);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "not found";
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
): todoWithId | "not found" => {
  const idxOfEntry = findIndexOfTodoById(id);
  // type guard against "not found"
  if (typeof idxOfEntry === "number") {
    return Object.assign(db[idxOfEntry], newData);
  } else {
    return "not found";
  }
};
