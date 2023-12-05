import React from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from "./pages/home"
import About from "./pages/about"
import Contact from './pages/contact'

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element= { < Home /> } />
      <Route path="/about" element= { <About /> } />
      <Route path="/contact" element= { <Contact/> } />
    </Routes>
    </>
  )
}
export default App
 