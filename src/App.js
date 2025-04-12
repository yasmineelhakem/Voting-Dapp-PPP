import React , { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { VotingPage } from './components/VotingPage';
import { CandidatesPage } from './components/CandidatesPage';
import { candidatesList } from './data/CandidatesList';
import { Res } from './components/LiveResults';


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

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    setAuth({
      isAuthenticated: true,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Implement actual registration
    setAuth({
      isAuthenticated: true,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

        <Route path="/vote" element={<VotingPage
                                      candidates={candidates}
                                      selectedCandidate={selectedCandidate}
                                      hasVoted={hasVoted}
                                      setSelectedCandidate={setSelectedCandidate}
                                      handleVote={handleVote}
                                      setAuth={setAuth}
                                     />} />

        <Route path="/Candidates" element={<CandidatesPage
                                            candidates={candidates} />} />
                                            
        <Route path="/res" element={<Res
                                            candidates={candidates}
                                            selectedCandidate={selectedCandidate}
                                            hasVoted={hasVoted}
                                            setSelectedCandidate={setSelectedCandidate}
                                            handleVote={handleVote}
                                            setAuth={setAuth}
                                                    />} />

      </Routes>

    </Router>
  );
}

export default App;
