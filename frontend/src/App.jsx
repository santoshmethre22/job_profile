import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import { AuthProvider } from "./context/User.context.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from './components/Home/Home.jsx';
import AddJob from './pages/job/AddJob/AddJob.jsx';
import { JobProvider } from './context/Job.context.jsx';
import Dashboard from './pages/Dashboard.jsx';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Header />
        <JobProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-job" element={<AddJob />} />
            <Route path='/dashboard' element={<Dashboard />} />
            
          </Routes>
        </JobProvider>
      </AuthProvider>
          <Footer />
    </BrowserRouter>
  );
}

export default App;
