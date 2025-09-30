/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {Asset} from '../types';

interface ResultViewerProps {
  asset: Asset;
  onEdit: (
    asset: Asset,
    positivePrompt: string,
    negativePrompt: string,
  ) => void;
  onBack: () => void;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({
  asset,
  onEdit,
  onBack,
}) => {
  const [positivePrompt, setPositivePrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');

  const handleEdit = () => {
    onEdit(asset, positivePrompt, negativePrompt);
    setPositivePrompt('');
    setNegativePrompt('');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-sm text-purple-400 hover:text-purple-300">
          &larr; Back to Studio
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Result Display */}
        <div className="bg-gray-800 p-2 rounded-lg">
          {asset.type === 'image' ? (
            <img
              src={asset.resultUrl}
              alt="Generated asset"
              className="w-full h-auto rounded-md"
            />
          ) : (
            <video
              src={asset.resultUrl}
              controls
              autoPlay
              loop
              className="w-full h-auto rounded-md"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Original Prompt</h3>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">
              {asset.prompt}
            </p>
          </div>
        </div>

        {/* Edit Panel */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Refine Your Creation</h2>
            <p className="text-gray-400 mt-1">
              Describe what you'd like to change or add.
            </p>
          </div>
          <div>
            <label
              htmlFor="positive-prompt"
              className="block text-sm font-medium text-gray-300">
              Things to add or change (Positive Prompt)
            </label>
            <textarea
              id="positive-prompt"
              rows={4}
              value={positivePrompt}
              onChange={(e) => setPositivePrompt(e.target.value)}
              placeholder="e.g., Add a swimming pool in the backyard, make the lighting warmer..."
              className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="negative-prompt"
              className="block text-sm font-medium text-gray-300">
              Things to remove (Negative Prompt)
            </label>
            <textarea
              id="negative-prompt"
              rows={3}
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g., Remove the car, no clouds in the sky..."
              className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <button
              onClick={handleEdit}
              disabled={!positivePrompt && !negativePrompt}
              className="w-full px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Re-generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
