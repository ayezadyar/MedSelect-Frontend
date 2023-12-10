









import React, { useState } from 'react';

const community = () => {
  const [feedback, setFeedback] = useState('');
  const [allFeedback, setAllFeedback] = useState([]);

  const handleInputChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the feedback list with the new feedback
    setAllFeedback((prevFeedback) => [...prevFeedback, feedback]);

    // Clear the input field
    setFeedback('');
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Discussion Form</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <label className="block mb-2">Your Feedback:</label>
        <textarea
          rows="4"
          cols="50"
          value={feedback}
          onChange={handleInputChange}
          className="border rounded p-2 w-full"
          placeholder="Share your feedback..."
        ></textarea>

        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Feedback
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">All Feedback:</h2>
        {allFeedback.length === 0 ? (
          <p>No feedback yet. Be the first to share!</p>
        ) : (
          <ul>
            {allFeedback.map((item, index) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default community;




