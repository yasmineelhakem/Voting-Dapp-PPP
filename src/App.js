import React , { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { VotingPage } from './components/VotingPage';
import { CandidatesPage } from './components/CandidatesPage';
//import { candidatesList } from './data/CandidatesList';
import { Res } from './components/LiveResults';
import ProtectedRoute from './components/ProtectedRoute';

export const candidatesList = [
  {
    id: 1,
    name: "Si Awab",
    votes: 0,
    description: "معذب قلوب البنات",
    image: "AwabBeaugosse.jpg"
  },
  {
    id: 2,
    name: "Madame Eya",
    votes: 0,
    description: "زوجي حبيبي وسندي",
    image: "AyoutaTahfouna.jpg"
  },
  {
    id: 3,
    name: "Demoiselle Amal",
    votes: 0,
    description: "كابستهم بنظراتي",
    image: "AmoulTahfoun.jpg"
  },
  {
    id: 4,
    name: "Señora Yasmine",
    votes: 0,
    description: "حجابي و صلاتي و بلعة كي تواتي",
    image: "mariposa.jpg"
  },
  {
    id: 5,
    name: "Patron Jadjoud",
    votes: 0,
    description: "على كل صوت تمرويحة بلاش لشيشتك",
    image: "patron.jpg"
  },
  {
    id: 6,
    name: "Si Loulou",
    votes: 0,
    description: " We listen and we jadj",
    image: "loulou.jpg"
  },
  {
    id: 7,
    name: "Chefa Imen",
    votes: 0,
    description: "لو كنت قطة حلوة كنت هبقى اكيد سيامي",
    image: "amoun.jpg"
  },
  {
    id: 8,
    name: "Chef Janjoun",
    votes: 0,
    description: "كلكولاتريسي فوقي و العمال على ربي",
    image: "janjoun.jpg"
  }
];

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [candidates, setCandidates] = useState(candidatesList);

  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token); // Save token
        setAuth({ isAuthenticated: true });
      } else {
        const error = await response.text();
        console.error('Login failed:', error);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          // TODO : badalaha b FormData.username kif tzidha fl form
          username: `User${Math.floor(Math.random() * 1000)}`
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token); // Save token
        setAuth({ isAuthenticated: true });
      } else {
        const error = await response.text();
        console.error('Registration failed:', error);
      }
    } catch (err) {
      console.error('Error during registration:', err);
    }
  };
    
    
    const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    };

    // Function to delete the token from localStorage
    const handleLogout = () => {
    localStorage.removeItem('access_token');
    // msh secure barsha tw nbadlouha bhal ekhr
    setAuth({ isAuthenticated: false });
    };

  const handleVote = () => {
    if (selectedCandidate === null) return;
    setCandidates(candidates.map(candidate =>
      candidate.id === selectedCandidate
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    ));
    setHasVoted(true);
  };



  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
    
        <Route path="/login" element={<AuthForm 
                                       type="login"
                                       auth={auth}
                                       formData={formData}
                                       setAuth={setAuth}
                                       handleInputChange={handleInputChange}
                                       handleSubmit={handleLogin}/>} />

        <Route path="/register" element={<AuthForm 
                                          type="register"
                                          auth={auth}
                                          formData={formData}
                                          setAuth={setAuth}
                                          handleInputChange={handleInputChange}
                                          handleSubmit={handleRegister}/>} />

        <Route path="/vote" element={<ProtectedRoute><VotingPage
                                      candidates={candidates}
                                      selectedCandidate={selectedCandidate}
                                      hasVoted={hasVoted}
                                      setSelectedCandidate={setSelectedCandidate}
                                      handleVote={handleVote}
                                      setAuth={setAuth}
                                     /></ProtectedRoute>} />

        <Route path="/Candidates" element={
          <ProtectedRoute>
            <CandidatesPage
              candidates={candidates} />
          <CandidatesPage
                                            candidates={candidates} /></ProtectedRoute>} />
                                            
        <Route path="/res" element={<ProtectedRoute><Res
                                            candidates={candidates}
                                            selectedCandidate={selectedCandidate}
                                            hasVoted={hasVoted}
                                            setSelectedCandidate={setSelectedCandidate}
                                            handleVote={handleVote}
                                            setAuth={setAuth}
                                                    /></ProtectedRoute>} />

      </Routes>

    </Router>
  );
}

export default App;
