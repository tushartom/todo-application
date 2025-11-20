import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./index.css";
import { MdDelete } from "react-icons/md";
export default function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [filterTasks, setFilterTasks] = useState({
    showOnlyCompletedTask: false,
    showOnlyIncompleteTask: false,
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTask(task) {
    if (task !== "") {
      let modifiedTask = task[0].toUpperCase() + task.slice(1);
      setTodos((prev) => [
        ...prev,
        { task: modifiedTask, id: uuidv4(), completed: false },
      ]);
      setTask("");
    }
  }
  function handleChange(e) {
    setTask(e.target.value);
  }
  function deleteTask(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }
  function handleTaskCompleted(id) {
    setTodos(
      todos.map((todo) => {
        return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
      })
    );
  }
  function handleEditTask(id) {
    setIsEditing((prev) => !prev);
    setTaskId(id);
  }
  function handleSaveDraft(taskDraft, taskId, inputRef) {
    console.log(inputRef.current);
    if (taskDraft !== "") {
      let modifiedTaskDraft = taskDraft[0].toUpperCase() + taskDraft.slice(1);
      setTodos(
        todos.map((todo) =>
          todo.id === taskId ? { ...todo, task: modifiedTaskDraft } : todo
        )
      );
    }

    setIsEditing(false);
  }
  return (
    <>
      <div className="header">
        <h1 className="app-name">To Do App</h1>
      </div>
      <div className="container">
        <AddTask addTask={addTask} task={task} onChange={handleChange} />
        <FeaturesRow
          filterTasks={filterTasks}
          setFilterTasks={setFilterTasks}
        />
        <Tasks
          todos={todos}
          deleteTask={deleteTask}
          handleTaskStatus={handleTaskCompleted}
          isEditing={isEditing}
          handleEditTask={handleEditTask}
          taskId={taskId}
          handleSaveDraft={handleSaveDraft}
          filterTasks={filterTasks}
        />
      </div>
    </>
  );
}

function AddTask({ addTask, task, onChange }) {
  return (
    <div className="add-task">
      <input
        type="text"
        value={task}
        onChange={onChange}
        placeholder="Grocery Shopping.."
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask(task);
        }}
      />
      <button onClick={() => addTask(task)}>Add</button>
    </div>
  );
}

function FeaturesRow({ filterTasks, setFilterTasks }) {
  return (
    <div className="filter-row">
      <div className="checkbox-wrapper-46">
        <input
          className="inp-cbx"
          id="show-completed-task"
          type="checkbox"
          checked={filterTasks.showOnlyCompletedTask}
          onChange={() =>
            setFilterTasks((prev) => ({
              ...prev,
              showOnlyCompletedTask: !prev.showOnlyCompletedTask,
            }))
          }
        />
        <label className="cbx" htmlFor="show-completed-task">
          <span>
            <svg width="12px" height="10px" viewBox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </svg>
          </span>
          <span>Completed Tasks</span>
        </label>
      </div>
      <div className="checkbox-wrapper-46">
        <input
          className="inp-cbx"
          id="show-incompleted-task"
          type="checkbox"
          checked={filterTasks.showOnlyIncompleteTask}
          onChange={() =>
            setFilterTasks((prev) => ({
              ...prev,
              showOnlyIncompleteTask: !prev.showOnlyIncompleteTask,
            }))
          }
        />
        <label className="cbx" htmlFor="show-incompleted-task">
          <span>
            <svg width="12px" height="10px" viewBox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </svg>
          </span>
          <span>Incompleted Tasks</span>
        </label>
      </div>
    </div>
  );
}
function Tasks({
  todos,
  deleteTask,
  handleTaskStatus,
  isEditing,
  handleEditTask,
  taskId,
  handleSaveDraft,
  filterTasks,
}) {
  const completedTasks = todos.filter((todo) => todo.completed === true);
  const incompletedTasks = todos.filter((todo) => todo.completed === false);
  return (
    <ul className="tasks-list">
      {filterTasks.showOnlyCompletedTask ||
        incompletedTasks.map((todo) => (
          <Task
            task={todo.task}
            key={todo.id}
            id={todo.id}
            completed={todo.completed}
            deleteTask={deleteTask}
            handleTaskStatus={handleTaskStatus}
            isEditing={isEditing}
            handleEditTask={handleEditTask}
            taskId={taskId}
            handleSaveDraft={handleSaveDraft}
          />
        ))}
      {filterTasks.showOnlyIncompleteTask ||
        completedTasks.map((todo) => (
          <Task
            task={todo.task}
            key={todo.id}
            id={todo.id}
            completed={todo.completed}
            deleteTask={deleteTask}
            handleTaskStatus={handleTaskStatus}
            isEditing={isEditing}
            handleEditTask={handleEditTask}
            taskId={taskId}
            handleSaveDraft={handleSaveDraft}
          />
        ))}
    </ul>
  );
}

function Task({
  task,
  id,
  deleteTask,
  completed,
  handleTaskStatus,
  isEditing,
  handleEditTask,
  taskId,
  handleSaveDraft,
}) {
  const [taskDraft, setTaskDraft] = useState(task);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <li className="task-item">
      {isEditing && id === taskId ? (
        <input
          className="edit-task-input"
          type="text"
          value={taskDraft}
          ref={inputRef}
          onChange={(e) => setTaskDraft(e.target.value)}
          onBlur={() => handleSaveDraft(taskDraft, id, inputRef)}
        />
      ) : (
        <p
          className={`task ${completed ? "task-completed" : ""}`}
          onDoubleClick={() => handleEditTask(id)}
        >
          {task}
        </p>
      )}

      <div className="task-manage-input">
        <div className="checkbox-wrapper-46">
          <input
            className="inp-cbx"
            id={`cbx-${id}`}
            type="checkbox"
            checked={completed}
            onChange={() => handleTaskStatus(id)}
          />
          <label className="cbx" htmlFor={`cbx-${id}`}>
            <span>
              <svg width="12px" height="10px" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </svg>
            </span>
          </label>
        </div>
        <button className="delete-btn" onClick={() => deleteTask(id)}>
          <MdDelete />
        </button>
      </div>
    </li>
  );
}
