import { useState } from 'react';
import SignUp from './components/SignUp.js';
import Home from './components/Home.js';
import SignIn from './components/SignIn.js';
import BasicModal from './components/CreateClass.js';
import Dashboard from './components/Dashboard.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Join from './components/JoinClass.js';
function App() {

  return (
    <div className="App">
      <Router>
        <Dashboard />
      </Router >
    </div>
  );
}

export default App;
