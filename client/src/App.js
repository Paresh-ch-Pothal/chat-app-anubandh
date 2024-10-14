import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Signup from './components/Signup';
import Profile from './components/Profile';



function App() {
  return (
    <>
      <Router>
        <div style={{ backgroundColor: "#2a2d33" }}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
