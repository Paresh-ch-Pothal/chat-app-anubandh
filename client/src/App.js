import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';



function App() {
  return (
    <>
      <div style={{ backgroundColor: "#2a2d33" }}>
        <Home/>
      </div>
    </>
  );
}

export default App;
