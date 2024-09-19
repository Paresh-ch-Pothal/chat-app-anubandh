import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';


function App() {
  return (
    <>
      <div style={{ backgroundColor: "#2a2d33" }}>
        <Router>
          <Navbar />
          <Home />
          <Routes>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
