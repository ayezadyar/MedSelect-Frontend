import React from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from "./pages/home"
import About from "./pages/about"
import Contact from './pages/contact'
import Login from './pages/login'
import Community from './pages/community'
import DoseAlarm from './pages/doseAlarm'

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element= { < Home /> } />
      <Route path="/about" element= { <About /> } />
      <Route path="/contact" element= { <Contact/> } />
      <Route path="/community" element= { <Community/> } />
      <Route path="/login" element= { <Login/> } />
      <Route path="/doseAlarm" element= { <DoseAlarm/> } />
    </Routes>
    </>
  )
}
export default App
 