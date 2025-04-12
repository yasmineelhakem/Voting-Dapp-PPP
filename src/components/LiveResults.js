import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Res = ({
    candidates,
}) => {
  const getTotalVotes = () => candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  
  return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold">Live Results</h2>
            </div>
            <div className="space-y-4">
                {candidates.map((candidate) => (
                    <div key={candidate.id} className="space-y-2">

                        <div className="flex justify-between">
                            <span className="text-gray-700">{candidate.name}</span>
                            <span className="text-indigo-600 font-semibold">
                            {getTotalVotes() > 0
                                ? Math.round((candidate.votes / getTotalVotes()) * 100)
                                : 0}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                            className="bg-indigo-600 h-2.5 rounded-full transition-all"
                            style={{
                                width: `${
                                getTotalVotes() > 0
                                    ? (candidate.votes / getTotalVotes()) * 100
                                    : 0
                                }%`,
                            }}
                            >
                            </div>
                        </div>
                    </div>
                    ))}

                    <div className="mt-4 pt-4 border-t">
                        <p className="text-gray-600">
                        Total Votes: <span className="font-semibold">{getTotalVotes()}</span>
                        </p>
                    </div>
            </div>
        </div>
  )
}