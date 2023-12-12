import { FaPaperclip } from 'react-icons/fa';
import './CommunitySection.css'; // Import the CSS file for styling
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHippo, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import HomeCard from '../components/homeCard';
import SideNav from '../components/sideNav';
import Papa from 'papaparse';

const community = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [image, setImage] = useState(null);

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
      {comments.slice().reverse().map((comment, index) => (
          <li key={index} className="comment-item">
            <p>{comment.text}</p>
            {comment.image && (
              <img src={URL.createObjectURL(comment.image)} alt="Comment Attachment" className="comment-image" />
            )}
            <ul className="reply-list">
              {comment.replies.map((reply, replyIndex) => (
                <li key={replyIndex} className="reply-item">
                  <p>{reply.text}</p>
                  {reply.image && (
                    <img src={URL.createObjectURL(reply.image)} alt="Reply Attachment" className="reply-image" />
                  )}
                </li>
              ))}
              <li>
                <form onSubmit={handleReplySubmit(index)} className="reply-form">
                  <input
                    type="text"
                    value={replyText}
                    onChange={handleReplyChange}
                    placeholder="Reply to this comment"
                    className="reply-input"
                  />
                  <label htmlFor={`reply-image-${index}`} className="attachment-icon">
                    <FaPaperclip />
                    <input
                      type="file"
                      id={`reply-image-${index}`}
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button type="submit" className="reply-btn">
                    Submit Reply
                  </button>
                </form>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default community;
