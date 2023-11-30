import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

//Author Student Number: 2925529

//Components

//Pages
import NoPage from './Pages/NoPage'
import HomePage from './Pages/HomePage';
import StudentPage from './Pages/StudentPage';
import AdvisorPage from './Pages/AdvisorPage';


function App() {
  return (
    <div className="App">

      <Router>
      <Routes>
      <Route path="*" element={<NoPage/>} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/studentui" element={<StudentPage/>} />
        <Route path="/advisorui" element={<AdvisorPage/>} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
