import React from 'react';
import { Vote, Lock, Users, BarChart3, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const LandingPage = ({ auth, setAuth }) => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Vote className="w-16 h-16 text-indigo-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Decentralized Voting Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Secure, transparent, and efficient voting system powered by blockchain technology.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="flex items-center justify-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Register
        </button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Lock className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
          <p className="text-gray-600">Your vote is protected by advanced cryptographic security.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Users className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
          <p className="text-gray-600">Simple interface designed for all users, regardless of technical expertise.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <BarChart3 className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
          <p className="text-gray-600">Watch the voting results update in real-time as votes are cast.</p>
        </div>
      </div>
    </div>
  );
};