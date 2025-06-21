import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UpdateTodoForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/todo/${id}`, {
           credentials: 'include' // Add this for session cookies
        });

        if (!response.ok) {
          throw new Error('Failed to fetch todo');
        }

        const todo = await response.json();
        setTitle(todo.title);
        setDescription(todo.description);
        setStatus(todo.status);
        setTargetDate(todo.targetDate ? todo.targetDate.split('T')[0] : '');
      } catch (err) {
        setError(err.message);
        console.error('Fetch todo error:', err);
      }
    };

    if (user) {
      fetchTodo();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials : "include",
        body: JSON.stringify({
          title,
          description,
          status,
          targetDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      navigate('/home');
    } catch (err) {
      setError(err.message);
      console.error('Update todo error:', err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Update Todo</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows="4"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="false">In Progress</option>
            <option value="true">Completed</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="targetDate">
            Target Date
          </label>
          <input
            type="date"
            id="targetDate"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Update Todo
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTodoForm;