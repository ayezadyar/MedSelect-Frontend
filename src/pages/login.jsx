import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

// import input from "./input";
import { auth } from "../Firebase";
import './index.css'

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <input className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none"
            label="Email"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Enter email address"
          />
        </div>
        <div className="mb-4">
          <input className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none"
            label="Password"
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
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Login
          </button>
          <p className="mt-2">
            Already have an account?{" "}
            <span className="text-blue-500">
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
