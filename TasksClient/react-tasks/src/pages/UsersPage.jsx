import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
// UsersPage.jsx
import { useSelector, useDispatch } from "react-redux";
import {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../store/slices/usersSlice";
import { userService } from "../services/userService";
import { FullFeaturedCrudGrid } from "../customControlls/customGrid";

export default function UsersPage() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);

  //columns passed to mui data grid, that will deside how will each column will be presented
  const columns = [
    {
      field: "userId",
      headerName: "ID",
      width: 150,
      editable: true,
      isValid: false,
    },
    {
      field: "fullName",
      headerName: "Name",
      width: 130,
      editable: true,
      required: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
      required: true,
    },
    {
      field: "telephone",
      headerName: "Telephone",
      width: 150,
      editable: true,
      required: true,
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await userService.getAll();
    const normalized = data.map((u) => ({
      ...u,
      isNew: false,
    }));

    dispatch(setUsers(normalized));
  };
  ///////validations - error handeling
  const validateRow = (row) => {
    const errors = [];

    if (!row.userId) {
      errors.push("ID is required");
    } else {
      const duplicate = users.some(
        (u) =>
          u.userId === row.userId && // same userId
          u.id !== row.id // but not the same row
      );

      if (duplicate) {
        errors.push("ID must be unique");
      }
    }

    if (!row.fullName || row.fullName.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }
    if (!row.email) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push("Valid email is required");
    } else {
      const duplicateEmail = users.some(
        (u) =>
          u.email.toLowerCase() === row.email.toLowerCase() && // case-insensitive
          u.id !== row.id // ignore current row
      );

      if (duplicateEmail) {
        errors.push("Email must be unique");
      }
    }
    if (!row.telephone || row.telephone.length < 10) {
      errors.push("Phone must be at least 10 digits");
    }

    return errors;
  };
  const showSuccess = (message) => {
    setSnackbar({ open: true, message, severity: "success" });
  };
  const showError = (message) => {
    setSnackbar({ open: true, message, severity: "error" });
  };
  ///////handle grid operations
  const handleAddUser = async (newUser) => {
    var errors = validateRow(newUser);
    //check if no errors found
    if (errors.length === 0) {
      try {
        const userDto = {
          userId: newUser.userId,
          fullName: newUser.fullName,
          email: newUser.email,
          telephone: newUser.telephone,
        };

        const createdUser = await await userService.create(userDto);
        newUser.id = createdUser.id;
        dispatch(addUser(newUser));
        showSuccess("User created successfully");
      } catch (er) {
        showError("Failed creating user");
      }
    } else {
      errors.forEach((error) => {
        showError(error);
      });
    }
    return newUser;
  };
  const hadleUpdateUser = async (updatedUser) => {
    var errors = validateRow(updatedUser);
    //if no errors found procced to
    if (errors.length === 0) {
      try {
        const userDto = {
          userId: updatedUser.userId,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          telephone: updatedUser.telephone,
        };
        await userService.update(userDto.userId, userDto);
        dispatch(updateUser(updatedUser));
        showSuccess("User updated successfully");
      } catch (er) {
        showError("Failed updating user");
      }
    } else {
      errors.forEach((error) => {
        showError(error);
      });
    }
  };
  const handleDeleteUser = async (user) => {
    try {
      console.log("handleDeleteUser", user);
      await userService.delete(user.id);
      dispatch(deleteUser(user.id));
      showSuccess("User deleted successfully");
    } catch (er) {
      showError("Failed deleting user");
    }
  };

  return (
    <Box style={{ margin: "20px" }}>
      <FullFeaturedCrudGrid
        isIdAutoGenerate={false}
        validateRow={validateRow}
        firstFieldFocus={"userId"}
        hadleUpdateRow={hadleUpdateUser}
        hadleAddRow={handleAddUser}
        handleDeleteRow={handleDeleteUser}
        columns={columns}
        rows={users}
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
