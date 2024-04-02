import { useState } from 'react';
import SignUp from './components/SignUp.js';
import Home from './components/Home.js';
import SignIn from './components/SignIn.js';
import Class from './components/Class.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import Cards from './components/Cards.js';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
function App() {

  return (
    <div className="App">
      <Router>
        <Dashboard />
      </Router>
    </div>
  );
}

export default App;
