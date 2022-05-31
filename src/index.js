import TodoListApp from "./components/TodoListApp";
import ReactDOM from "react-dom/client";
import './css/styles.css';
function App() {
  return(
    <div className="todo-list-container">
      <TodoListApp />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
