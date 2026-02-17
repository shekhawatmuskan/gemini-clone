import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="root">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Main onOpenSidebar={() => setIsSidebarOpen((prev) => !prev)} />
    </div>
  );
};

export default App;
