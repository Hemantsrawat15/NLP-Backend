import React, { useState } from 'react';
import { Send, Brain } from 'lucide-react';

const TaskInputForm = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setQuery('');
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6  max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800">
            Operational Research
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 h-20 ">
              NLP Agent
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Harness the power of advanced natural language processing for your operational research needs. 
            Ask questions, analyze data, and get insights instantly.
          </p>
        </div>

        {/* Input Form */}
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Initiate a query or send a command to the AI..."
                className="w-full min-h-[120px] p-6 pr-16 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 resize-none outline-none transition-all duration-200 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm"
                rows={4}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute bottom-4 right-4 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskInputForm;
