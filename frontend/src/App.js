import React , { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { VotingPage } from './components/VotingPage';
import { CandidatesPage } from './components/CandidatesPage';
import { Res } from './components/LiveResults';
import { MetaMaskLogin } from './components/ConnectWallet';
import { ethers } from 'ethers';
import { contractAddress, contractAbi } from "./constants/contract_data"; 
import ProtectedRoute from './components/ProtectedRoute';
import { BACKEND_URL } from './apiConfig';

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [remainingTime, setremainingTime] = useState('');
  const [votingStatus, setVotingStatus] = useState(true);
  const [CanVote, setCanVote] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getCandidates();
      await getRemainingTime();
      await getCurrentStatus();
    };
    
    fetchData();
  }, []);

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
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
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
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

const getCandidates = async(candidateId) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const candidatesList = await contractInstance.getAllVotes();
    const formattedCandidates = candidatesList.map((candidate, index) => {
    const voteCount = Number(ethers.toBigInt(candidate.voteCount));

        return {
          id: index,
          name: candidate.name,
          voteCount
        }
    });
    setCandidates(formattedCandidates);   
};


async function getRemainingTime() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);
  const time = await contractInstance.getRemainingTime();
  setremainingTime(parseInt(time, 16));
}

const handleVote = async(candidateId) => {
      console.log(candidateId);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      const tx = await contractInstance.vote(candidateId);//yasmine remember bch thothoulna lvariable
      await tx.wait();
      console.log("transaction successful");
      canVote(); //to add the address of the user who voted in the voters table
      
  };

async function canVote() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract (
    contractAddress, contractAbi, signer
  );
  const voteStatus = await contractInstance.voters(await signer.getAddress());
  setCanVote(voteStatus);

}

async function getCurrentStatus() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract (contractAddress, contractAbi, signer);
  const status = await contractInstance.getVotingStatus();
  console.log(status);
  setVotingStatus(status);
}

  const connectToMetamask = () => {

  };
  // Function to delete the token from localStorage
  const handleLogout = () => {
  localStorage.removeItem('access_token');
  // msh secure barsha tw nbadlouha bhal ekhr
  setAuth({ isAuthenticated: false });
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
         </ProtectedRoute>
         } />
                                            
        <Route path="/res" element={<ProtectedRoute><Res
                                            candidates={candidates}
                                            selectedCandidate={selectedCandidate}
                                            hasVoted={hasVoted}
                                            setSelectedCandidate={setSelectedCandidate}
                                            handleVote={handleVote}
                                            setAuth={setAuth}
                                                    /></ProtectedRoute>} />


        <Route path="/logmeta" element={<MetaMaskLogin connectWallet = {connectToMetamask}   />} />

      </Routes>

    </Router>
  );
}

export default App;
