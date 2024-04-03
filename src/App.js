import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';

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
