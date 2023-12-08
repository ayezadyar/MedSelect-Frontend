import React from 'react'
import Header from "../components/header"
import { signInWithGoogle } from '../Firebase'
import './index.css'


export default function Login() {
  return (
    <div>
      <Header />
      <button onClick={signInWithGoogle}> Sign In With Google</button>
      <h1>{localStorage.getItem("name")}</h1>
      <h1>{localStorage.getItem("email")}</h1>
     

    </div>
  )
}
