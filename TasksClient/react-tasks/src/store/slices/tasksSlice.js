// usersSlice.js - This is what you should actually use
import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
  },
  reducers: {
    // These are like pre-written rules
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((u) => u.id !== action.payload);
    },
    updateTask: (state, action) => {
      const updated = action.payload;
      const index = state.tasks.findIndex((u) => u.id === updated.id);

      if (index !== -1) {
        state.tasks[index] = updated;
      }
    },
  },
});

// Export actions (these are created automatically!)
export const { setTasks, addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
