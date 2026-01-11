// usersSlice.js - This is what you should actually use
import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
  },
  reducers: {
    // These are like pre-written rules
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    updateUser: (state, action) => {
      const updated = action.payload;
      const index = state.users.findIndex((u) => u.id === updated.id);

      if (index !== -1) {
        state.users[index] = updated;
      }
    },
  },
});

export const { setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
