import { FaPaperclip } from 'react-icons/fa';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SideNav from '../components/sideNav';

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
      <div className="flex flex-col h-screen">
         {/* Side Navigation */}
         <SideNav isNavOpen={isNavOpen} toggleNav={toggleNav} />

         <div className={`flex flex-col transition-margin duration-300 ${isNavOpen ? "" : ""}`}>
            {/* Burger Icon */}
            <button
               className={`absolute top-4 left-4 cursor-pointer font-bold ${isNavOpen ? "text-white" : "text-black"
                  }`}
               onClick={toggleNav}
            >
               <FontAwesomeIcon icon={faBars} size="lg" />
            </button>

            {/* Centered Comment Section */}
            <div className="ml-[40%] mt-1">
               <pre>  <h1 className="text-2xl font-bold mb-4 text-[#294a26]">                 Comment Section</h1></pre>
               <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex items-center gap-3">
                     <input
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment"
                        className="px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#294a26] focus:border-transparent w-64"
                     />
                     <label htmlFor="comment-image" className="cursor-pointer">
                        <FaPaperclip className=" text-[#294a26]" />
                        <input
                           type="file"
                           id="comment-image"
                           accept="image/*"
                           onChange={handleImageChange}
                           className="hidden"
                        />
                     </label>
                     <button type="submit" className="bg-[#517028] hover:bg-[#294a26] text-white px-4 py-2 rounded-md transition duration-300">
                        Submit Comment
                     </button>
                  </div>
               </form>
               <ul className="space-y-2 mx-auto">
                  {comments.slice().reverse().map((comment, index) => (
                     <li key={index} className="border p-5 rounded-md bg-gray-200 w-[470px]">
                        <p>{comment.text}</p>
                        {comment.image && (
                           <img
                              src={URL.createObjectURL(comment.image)}
                              alt="Comment Attachment"
                              className="mt-3 rounded-md max-w-full max-h-36 object-cover"
                           />
                        )}
                        <ul className="pl-6 space-y-3 mt-3">
                           {comment.replies.map((reply, replyIndex) => (
                              <li key={replyIndex} className="border p-3 rounded-md bg-white">
                                 <p>{reply.text}</p>
                                 {reply.image && (
                                    <img
                                       src={URL.createObjectURL(reply.image)}
                                       alt="Reply Attachment"
                                       className="mt-3 rounded-md max-w-full max-h-36 object-cover"
                                    />
                                 )}
                              </li>
                           ))}
                           <li>
                              <form onSubmit={handleReplySubmit(index)} className="flex items-center gap-2">
                                 <input
                                    type="text"
                                    value={replyText}
                                    onChange={handleReplyChange}
                                    placeholder="Reply to this comment"
                                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent w-48"
                                 />
                                 <label htmlFor={`reply-image-${index}`} className="cursor-pointer">
                                    <FaPaperclip className="text-[#294a26]" />
                                    <input
                                       type="file"
                                       id={`reply-image-${index}`}
                                       accept="image/*"
                                       onChange={handleImageChange}
                                       className="hidden"
                                    />
                                 </label>
                                 <button type="submit" className="bg-[#517028] hover:bg-[#294a26] text-white px-3 py-1 rounded-md transition duration-300">
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

         {/* Other Content */}
         {/* ... (your other content) */}
      </div>
   );

};

export default community;
