import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, auth } from "../Firebase";
import Login from "./login";
import './index.css'
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

function Signup({ setSignupOpen }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  // const [isSignupOpen, setSignupOpen] = useState(false);

  const handleLoginToggle = () => {
    setLoginOpen(!isLoginOpen);
  };

  const handleSignupToggle = () => {
    setSignupOpen(!isSignupOpen);
  };

  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        const user = res.user;
        await updateProfile(user, {
          displayName: values.name,
        });
        await setDoc(doc(db, "users", user.uid), {
          displayName: values.name,
          email: values.email,
          // Add any other user data you want to store
        });
        setSubmitButtonDisabled(false);
        navigate("/");
        setSignupOpen(false)
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-lg h-96 w-96">
          <h1 className="text-3xl font-bold mb-6 text-[#294a26]">Signup</h1>
          <div className="mb-4">
            <input
              label="Name"
              className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none"
              placeholder="Enter your name"
              onChange={(event) =>
                setValues((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </div>
          <div className="mb-4">
            <input
              label="Email"
              type="email"
              required
              placeholder="Enter email address"
              onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))
              }
              className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              required
              label="Password"
              placeholder="Enter password"
              onChange={(event) =>
                setValues((prev) => ({ ...prev, pass: event.target.value }))
              }
              className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none"
            />
          </div>
          <div className="flex items-center mb-4">
            <b className="text-red-500 mr-2">{errorMsg}</b>
            <button
              className="bg-[#517028] hover:bg-[#294a26] text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleSubmission}
              disabled={submitButtonDisabled}
            >
              Signup
            </button>
          </div>
          <p>
            Already have an account?{" "}
            <span className="text-[#294a26]">
              <button className="text-[#294a26] font-semibold" onClick={handleLoginToggle}>
                Login
              </button>
            </span>
          </p>
        </div>
        {/* Login Popup */}
        {isLoginOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center">
            <Login handleClose={setLoginOpen} />
          </div>
        )}
      </div>
    </>
  );
}

export default Signup;
