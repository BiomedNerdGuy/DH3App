import React, { useState } from 'react';

function App() {
  const [currentScreen, setCurrentScreen] = useState('launch');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            POTS Digital Health App
          </h1>
          <p className="text-gray-600 mb-8">
            Level 1 Implementation
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setCurrentScreen('login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Existing User Login
            </button>

            <button
              onClick={() => setCurrentScreen('new-user')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              New User
            </button>

            <button
              onClick={() => setCurrentScreen('clinician')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Clinician Login
            </button>
          </div>

          {currentScreen !== 'launch' && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Current Screen: <span className="font-semibold">{currentScreen}</span>
              </p>
              <button
                onClick={() => setCurrentScreen('launch')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Back to Launch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
