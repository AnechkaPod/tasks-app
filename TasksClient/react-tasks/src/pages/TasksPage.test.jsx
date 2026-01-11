import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/slices/tasksSlice";
import usersReducer from "../store/slices/usersSlice";
import TasksPage from "./TasksPage";
import { taskService } from "../services/taskService";

jest.mock("../services/taskService");

function renderWithStore(ui) {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
      users: usersReducer,
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

test("renders tasks loaded from API", async () => {
  taskService.getAll.mockResolvedValue([
    {
      id: 1,
      title: "My First Task",
      dueDate: "2025-12-28",
      userId: "u1",
    },
  ]);

  renderWithStore(<TasksPage />);

  await waitFor(() => {
    expect(screen.getByText("My First Task")).toBeInTheDocument();
  });
});