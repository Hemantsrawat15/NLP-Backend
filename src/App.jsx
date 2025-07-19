import React from "react";
import TaskInputForm from "./components/TaskInputForm";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <TaskInputForm />
    </div>
  );
}

export default App;
