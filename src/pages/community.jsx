import React, { useState, useRef } from 'react';

const community = () => {
  const [feedback, setFeedback] = useState('');
  const [image, setImage] = useState(null);
  const [allFeedback, setAllFeedback] = useState([]);
  const [includeImage, setIncludeImage] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const scrollTargetRef = useRef(null);

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

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
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

    // Scroll to the newly added feedback
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const highlightText = (text) => {
    if (searchKeyword.trim() === '') {
      return text;
    }

    const regex = new RegExp(`(${searchKeyword})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Discussion Form</h1>

      <div className="relative mb-8">
        <label className="block mb-2">Search Keyword:</label>
        <input
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder="Enter keyword to highlight"
          className="border rounded p-2 w-48 sm:w-64 absolute top-0 right-0 mt-2 mr-2"
        />
      </div>

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

      <div ref={scrollTargetRef}>
        <h2 className="text-xl font-bold mb-4">All Feedback:</h2>
        {allFeedback.length === 0 ? (
          <p>No feedback yet. Be the first to share!</p>
        ) : (
          <ul>
            {allFeedback.map((item, index) => (
              <li key={index} className="mb-4">
                <p>{highlightText(item.text)}</p>
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

export default community;
