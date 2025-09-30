/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {HomeIcon} from './icons';

export const PasswordPage: React.FC<{onUnlock: () => void}> = ({onUnlock}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const correctPassword = 'CraneBay';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onUnlock();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 font-sans p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <HomeIcon className="w-10 h-10 text-purple-400" />
          <h1 className="text-2xl font-semibold text-white tracking-wide">
            Leonardo{' '}
            <span className="font-light text-gray-400">
              by Lake and Land Studio
            </span>
          </h1>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800 transition-colors">
                Enter Studio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
