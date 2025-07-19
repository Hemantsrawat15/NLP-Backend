import React from 'react';
import { MessageSquarePlus, Bot, User } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-end h-16">
          {/* Logo and Title */}
          {/* <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI NLP Agent</h1>
              <p className="text-sm text-slate-300">Operational Research</p>
            </div>
          </div> */}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
              <MessageSquarePlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <div className="flex items-center justify-center w-9 h-9 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors cursor-pointer">
              <User className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
