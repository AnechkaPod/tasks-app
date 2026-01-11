import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import TasksPage from "./TasksPage";
import UsersPage from "./UsersPage";

export default function MainPage() {
  const [selectedMenu, setSelectedMenu] = React.useState("1");

  const handleMenuChange = (event, newValue) => {
    setSelectedMenu(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedMenu}
          onChange={handleMenuChange}
          aria-label="lab API tabs example"
        >
          <Tab label="Users" value="1" />
          <Tab label="Tasks" value="2" />
        </Tabs>
      </Box>
      {selectedMenu === "1" && <UsersPage />}
      {selectedMenu === "2" && <TasksPage />}
    </Box>
  );
}
