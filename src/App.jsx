import React from "react";
import TaskInputForm from "./components/TaskInputForm";
import NavBar from "./components/NavBar";
import MaritimeRouteDashboard from "./components/MaritimeRouteDashboard";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <NavBar />
      <TaskInputForm /> */}
      <MaritimeRouteDashboard />
    </div>
  );
}

export default App;
