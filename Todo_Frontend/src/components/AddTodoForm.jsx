import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddTodoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/todo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${user?.token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          targetDate,
          status: 'IN_PROGRESS',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Add todo error:', err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Add New Todo</h2>
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
            Add Todo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodoForm;