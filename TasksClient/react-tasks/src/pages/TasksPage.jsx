import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
// UsersPage.jsx
import { useSelector, useDispatch } from "react-redux";
import {
  updateTask,
  addTask,
  deleteTask,
  setTasks,
} from "../store/slices/tasksSlice";
import { setUsers } from "../store/slices/usersSlice";
import { taskService } from "../services/taskService";
import { userService } from "../services/userService";
import { FullFeaturedCrudGrid } from "../customControlls/customGrid";

const PRIORITY_OPTIONS = [
  { value: 0, label: "Low" },
  { value: 1, label: "Medium" },
  { value: 2, label: "High" },
  { value: 3, label: "Critical" },
];

export default function TasksPage() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const users = useSelector((state) => state.users.users);
  //columns passed to mui data grid, that will deside how will each column will be presented
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 130,
      editable: true,
      required: true,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      type: "date",
      width: 130,
      editable: true,
      required: true,
      valueGetter: (params) => {
        return new Date(params);
      },
      renderCell: (params) => {
        if (!params.value) return "";
        return params.value.toLocaleDateString();
      },
    },
    {
      field: "userId",
      headerName: "User",
      type: "singleSelect",
      valueOptions: users.map((u) => ({
        value: u.id,
        label: u.fullName,
      })),
      width: 130,
      editable: true,
    },
    {
      field: "priority",
      headerName: "Priority",
      type: "singleSelect",
      width: 130,
      editable: true,
      valueOptions: PRIORITY_OPTIONS,
    },
  ];

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    const data = await taskService.getAll();

    console.log("fetchTasks data", data);
    const normalized = data.map((u) => ({
      ...u,
      isNew: false,
    }));

    dispatch(setTasks(normalized));
  };

  const fetchUsers = async () => {
    const data = await userService.getAll();
    const normalized = data.map((u) => ({
      ...u,
      isNew: false,
    }));

    dispatch(setUsers(normalized));
  };

  ///////validations - error handeling
  const showSuccess = (message) => {
    setSnackbar({ open: true, message, severity: "success" });
  };

  const showError = (message) => {
    setSnackbar({ open: true, message, severity: "error" });
  };

  const validateRow = (row) => {
    const errors = [];

    if (!row.title) errors.push("Title is required");
    if (!row.dueDate) errors.push("dueDate is required");
    if (!row.userId) errors.push("assigned user is required");
    if (row.priority === undefined || row.priority === null) {
      errors.push("Priority is required");
    }
    return errors;
  };

  ///////handle grid operations
  const handleAddTask = async (newTask) => {
    const taskDto = {
      title: newTask.title,
      userId: newTask.userId,
      dueDate: newTask.dueDate,
      description: newTask.title,
      priority: newTask.priority,
    };
    console.log("handleAddTask", taskDto);
    const createdTask = await taskService.create(taskDto);
    dispatch(updateTask(createdTask));

    return {
      ...newTask,
      id: createdTask.id, //server id
      isNew: false,
    };
  };
  const hadleUpdateTask = async (updatedTask) => {
    var errors = validateRow(updatedTask);
    //if no errors found procced to
    if (errors.length === 0) {
      try {
        const taskDto = {
          id: updatedTask.id,
          title: updatedTask.title,
          description: updatedTask.title,
          userId: updatedTask.userId,
          dueDate: updatedTask.dueDate,
          priority: updatedTask.priority,
        };
        console.log("taskDto", taskDto);
        await taskService.update(taskDto.id, taskDto);
        dispatch(updateTask(updatedTask));
        showSuccess("User updated successfully");
      } catch (er) {
        showError("Failed updating task");
      }
    } else {
      errors.forEach((error) => {
        showError(error);
      });
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await taskService.delete(task.id);
      dispatch(deleteTask(task.id));
      showSuccess("Task deleted successfully");
    } catch (er) {
      showError("Failed deleting task");
    }
  };

  return (
    <Box style={{ margin: "20px" }}>
      <FullFeaturedCrudGrid
        isIdAutoGenerate={true}
        validateRow={validateRow}
        firstFieldFocus={"title"}
        hadleUpdateRow={hadleUpdateTask}
        hadleAddRow={handleAddTask}
        handleDeleteRow={handleDeleteTask}
        columns={columns}
        rows={tasks}
        showError={showError}
      ></FullFeaturedCrudGrid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
