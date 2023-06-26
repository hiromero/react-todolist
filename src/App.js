import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [newTodos, setNewTodos] = useState("");
  const [todos, setTodos] = useState([]);
  const [finishedTodos, setFinishedTodos] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    fetch('http://127.0.0.1:8000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTodos,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.status === 'success') {
          setNewTodos("");
          setTodos(data.todos);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  function toggleTodo(id) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
  }

  function deleteTodo(id) {
    fetch(`http://127.0.0.1:8000/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => await response.json())
      .then((data) => {
        console.log(data);

        if (data.status === 'success') {
          setTodos(prevTodos => prevTodos.filter((row) => row.id !== id)); // Use previous state
        }
      }).catch((error) => {
        console.error('Error:', error);
      });
  }

  const getData = async () => {
    await fetch("http://127.0.0.1:8000/api/todos")
      .then(async (response) => await response.json())
      .then((data) => {
        const updateTodos = data.todos.map((todo) => ({
          ...todo,
        }));
        setTodos(updateTodos);
      })
  }

  useEffect(() => {
    getData();
    console.log(todos);
  }, []);

  useEffect(() => {
    const finished = todos.filter((todo) => todo.completed);
    setFinishedTodos(finished);
  }, [todos]);

  return (
    <div className="bg-gray-700">
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <div className="flex flex-col gap-1">
          <label className="">
            New Title
          </label>
          <input
            type="text"
            className="text-blue-900 px-3"
            id="todo"
            value={newTodos}
            onChange={e => setNewTodos(e.target.value)} />
        </div>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Add</button>
      </form>
      <h1 className="mt-6 mb-2 text-2xl">
        Todo List
      </h1>
      <h1 className="mt-6 mb-2 text-sm">
        *Note, reload page api issue
      </h1>
      <ul className="flex flex-col m-0 p-0 ml-3 gap-3">
        {todos.map(todo => {
          if (!todo.completed) {
            return (
              <li key={todo.id} className="flex gap-5 items-center">
                <label className='flex gap-5'>
                  <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="" />
                  {todo.title}
                </label>
              </li>
            )
          }
          return null;
        })}
      </ul>
      <h1 className="mt-6 mb-2 text-2xl">Finished Todos</h1>
      <ul className="flex flex-col m-0 p-0 ml-3 gap-3" key={finishedTodos.length}>
        {finishedTodos.map(todo => {
          return (
            <li key={todo.id} className="flex gap-5 items-center">
              <label>
                <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="" />
                {todo.title}
              </label>
              <button className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded" onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
