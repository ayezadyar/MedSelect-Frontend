import React from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from "./pages/home"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element= { < Home /> } />
      <Route path="/about" element= { <div>About </div> } />
      <Route path="/contact" element= { <div>Contact us</div> } />
    </Routes>
    </>
  )
}
export default App
 