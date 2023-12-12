import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// import input from "./input";
import { auth } from "../Firebase";

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        await updateProfile(user, {
          displayName: values.name,
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-96">
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
              placeholder="Enter email address"
              onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))
              }
              className="appearance-none border-b border-gray-300 w-full py-2 leading-tight focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <input
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
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
export default Signup;