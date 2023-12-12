import { FaPaperclip } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import './CommunitySection.css'; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SideNav from '../components/sideNav';

const Community = () => {
  const [isNavOpen, setNavOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [image, setImage] = useState(null);
  const [externalComments, setExternalComments] = useState([]);
  const [showPastComments, setShowPastComments] = useState(false);
  const [pastComments, setPastComments] = useState([]);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.trim() !== '') {
      const newComments = [...comments, { text: newComment, replies: [], image }];
      setComments(newComments);
      setNewComment('');
      setImage(null);
    }
  };

  const handleReplySubmit = (commentIndex) => (event) => {
    event.preventDefault();
    if (replyText.trim() !== '') {
      const newComments = [...comments];
      newComments[commentIndex].replies.push({ text: replyText, image });
      setComments(newComments);
      setReplyText('');
      setImage(null);
    }
  };

  useEffect(() => {
    // Example API endpoint for fetching external comments
    const apiEndpoint = 'https://api.example.com/comments';

    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => setExternalComments(data))
      .catch((error) => console.error('Error fetching comments:', error));

    // Set example past comments
    setPastComments([
      { text: 'Past Comment 1', additionalInfo: 'Additional Info 1' },
      { text: 'Past Comment 2', additionalInfo: 'Additional Info 2' },
    ]);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <div
        className={`flex flex-col flex-1 justify-center items-center min-h-screen transition-margin duration-300 ${
          isNavOpen ? "ml-64" : ""
        }`}
      >
        {/* Burger Icon */}
        <button
          className={`absolute top-4 left-4 cursor-pointer font-bold ${
            isNavOpen ? "text-white" : "text-black"
          }`}
          onClick={toggleNav}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>
      <div className="comment-section">
        <h2>Comment Section</h2>
        <button onClick={() => setShowPastComments(!showPastComments)} className="toggle-past-comments-btn">
          {showPastComments ? 'Hide Past Comments' : 'Show Past Comments'}
        </button>
        {showPastComments && (
          <div className="past-comments-section">
            {/* Render past comments here */}
            {/* You can use a similar structure as you did for user-submitted and external comments */}
            <ul className="past-comments-list">
              {/* Map over past comments and render them */}
              {pastComments.map((comment, index) => (
                <li key={index} className="past-comment-item">
                  <p>{comment.text}</p>
                  <p>{comment.additionalInfo}</p>
                  {/* Include any additional information for past comments */}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment"
            className="comment-input"
          />
          <label htmlFor="comment-image" className="attachment-icon">
            <FaPaperclip />
            <input
              type="file"
              id="comment-image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
          <button type="submit" className="comment-btn">
            Submit Comment
          </button>
        </form>
        <ul className="comment-list">
          {/* User-submitted comments */}
          {comments.slice().reverse().map((comment, index) => (
            <li key={index} className="comment-item">
              {/* ... existing user-submitted comment code */}
            </li>
          ))}
          {/* External comments */}
          {externalComments.map((externalComment, index) => (
            <li key={`external-${index}`} className="comment-item external-comment">
              {/* ... existing external comment code */}
            </li>
          ))}
        </ul>
        <button onClick={handleGoBack} className="go-back-btn">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Community;
