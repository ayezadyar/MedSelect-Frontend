import React, { useState } from 'react';

const DiscussionForm = () => {
  const [feedback, setFeedback] = useState('');
  const [image, setImage] = useState(null);
  const [allFeedback, setAllFeedback] = useState([]);
  const [includeImage, setIncludeImage] = useState(false);

  const handleInputChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleToggleImage = () => {
    setIncludeImage(!includeImage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFeedback = {
      text: feedback,
      image: includeImage ? URL.createObjectURL(image) : null,
    };

    setAllFeedback((prevFeedback) => [...prevFeedback, newFeedback]);

    setFeedback('');
    setImage(null);
    setIncludeImage(false);
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

        <div className="mt-4 mb-4">
          <button
            type="button"
            onClick={handleToggleImage}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              includeImage ? 'bg-opacity-50' : ''
            }`}
          >
            {includeImage ? 'Remove Image' : 'Add Image'}
          </button>
        </div>

        {includeImage && (
          <div>
            <label className="block mt-2 mb-2">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
              <li key={index} className="mb-4">
                <p>{item.text}</p>
                {item.image && (
                  <img
                    src={item.image}
                    alt={`User Feedback ${index}`}
                    className="mt-2 rounded"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DiscussionForm;







