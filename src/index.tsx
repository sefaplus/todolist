import TodoListApp from "./components/TodoListApp"; // Werid but changing webpack.config to resolve .tsx extensions doesnt allow to import .tsx by default. So i had to manuall add extensions for everything to work correctly
import ReactDOM from "react-dom/client";
import React from 'react'; 
import "./css/styles.css";
function App() {
  return (
    <div className="todo-list-container">
      <TodoListApp />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
