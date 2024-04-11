import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import './App.css';
import InputOutput from './InputOutput';
import Ask from './Ask';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Ask />} />
        <Route path="/ask" element={<InputOutput />} />
      </Routes>
    </Router>
    // {/* <InputOutput></InputOutput> */}
  );
};

export default App;
