import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import Signup from "./Signup";
import './index.css'

function Login({ setLoginOpen }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  // const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);



  const handleSignupToggle = () => {
    setSignupOpen(!isSignupOpen);
    // setLoginOpen(true)

  };

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        console.log('i am login')
        setSubmitButtonDisabled(false);
        setLoginOpen(false);
        setSignupOpen(false);
        navigate("/")
        // handleLoginToggle(); // Hide login popup
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  return (
    <div className=" flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg h-96 w-96">
        <h1 className="text-2xl font-bold mb-4 text-[#294a26]">Login</h1>
        <div className="mb-4">
          <input
            className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none"
            label="Email"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Enter email address"
            type="email"
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none"
            label="Password"
            required
            type="password"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
            placeholder="Enter Password"
          />
        </div>
        <div className="mt-4">
          <b className="text-red-500">{errorMsg}</b>
          <button
            disabled={submitButtonDisabled}
            onClick={handleSubmission}
            className="bg-[#517028] hover:bg-[#294a26] text-white py-2 px-4 rounded"
          >
            Login
          </button>
          <p className="mt-2">
            Don't have an account?{" "}
            <span className="text-[#294a26]">
              <button
                className="text-[#294a26] font-semibold"
                onClick={handleSignupToggle}
              >
                Sign up
              </button>
            </span>
          </p>
        </div>
      </div>
      {isSignupOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center">
          <Signup setSignupOpen={setSignupOpen} />
        </div>
      )}
    </div>
  );
}

export default Login;
