import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";
import About from "./pages/about";
import Contact from './pages/contact';
import Login from './pages/login';
import Signup from './pages/Signup';
import Community from './pages/community';
import DoseAlarm from './pages/doseAlarm';
// import Chat from './components/chat';
import ChatBox from './components/community/chat';
import DoctorList from './components/doctors/doctorsList';
import DocChat from './components/doctors/docChat';
import DoctorOnBoard from './pages/doctorOnboard';
import { AlarmProvider } from './AlarmContext';
import GlobalAlarmListener from './GlobalAlarmListener';

function App() {
  return (
    <Router>
      <AlarmProvider>
        <GlobalAlarmListener />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/doseAlarm" element={<DoseAlarm />} />
          <Route path="/chat" element={<ChatBox />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/docchat/:otherUserID" element={<DocChat />} />
          <Route path="/doctorOnboard" element={<DoctorOnBoard />} />
        </Routes>
      </AlarmProvider>
    </Router>
  );
}

export default App;
