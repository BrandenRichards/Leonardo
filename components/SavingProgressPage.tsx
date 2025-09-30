/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState} from 'react';

const MESSAGES = [
  'Consulting with the digital muses...',
  'Warming up the AI architect...',
  'Sketching the initial blueprints...',
  'Rendering the fine details...',
  'Bringing your vision to life...',
  'This can take a minute or two...',
];

/**
 * A fullscreen overlay that displays a loading animation and cycles through
 * reassuring messages to the user during generation.
 */
export const LoadingOverlay: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in"
      aria-live="polite"
      aria-busy="true">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      <h2 className="text-2xl font-bold text-white mt-8">
        Generating your creation...
      </h2>
      <p className="text-gray-400 mt-2 transition-opacity duration-500">
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
};
