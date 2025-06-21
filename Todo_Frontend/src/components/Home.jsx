import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  //   const { user } = useAuth();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/todo/', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        // setTodos(data);
         setTodos(Object.values(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todo/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
     return status
      ? 'bg-green-300 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Todos</h1>
        <Link
          to="/todos/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Add New Todo
        </Link>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600">No todos found</h2>
          <p className="text-gray-500 mt-2">Create your first todo to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-200
                          ${todo.status ? 'border-green-400' : 'border-gray-200'}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{todo.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}
                  >
                    {todo.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{todo.description}</p>

                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Due: {formatDate(todo.targetDate)}
                </div>

                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/todos/edit/${todo.id}`}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}