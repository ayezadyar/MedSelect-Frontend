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
import QRCodeDisplay from './pages/QR';
import PharmacyOnBoard from './pages/pharmaOnboard';
import RequestHandle from './components/pharmacy/requestHandle';
import RequestGenerate from './components/pharmacy/requestGenerate';
import Maps from './components/pharmacy/map';
import StripeComponent from './components/stripe/stripee';

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
          <Route path="/share" element={<QRCodeDisplay />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/docchat/:otherUserID" element={<DocChat />} />
          <Route path="/doctorOnboard" element={<DoctorOnBoard />} />
          <Route path="/pharmacyOnboard" element={<PharmacyOnBoard />} />
          <Route path="/requestHandle" element={<RequestHandle />} />
          <Route path="/requestGenerate" element={<RequestGenerate />} />
          <Route path="/map" element={<Maps />} />
          <Route path="/pay" element={<StripeComponent />} />
        </Routes>
      </AlarmProvider>
    </Router>
  );
}

export default App;
