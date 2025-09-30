/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {Asset} from '../types';
import {ImageIcon, VideoCameraIcon} from './icons';

interface HistoryPanelProps {
  history: Asset[];
  onSelect: (assetId: string) => void;
  activeAssetId?: string | null;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  activeAssetId,
}) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="p-4 text-lg font-semibold text-white border-b border-gray-700/50 flex-shrink-0">
        History
      </h2>
      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-sm text-gray-400">
            Your generated images and videos will appear here.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-700/50">
            {history.map((asset) => (
              <li key={asset.id}>
                <button
                  onClick={() => onSelect(asset.id)}
                  className={`w-full text-left p-3 hover:bg-purple-900/20 transition-colors ${
                    activeAssetId === asset.id ? 'bg-purple-900/30' : ''
                  }`}>
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0 w-20 h-20 rounded-md bg-gray-700">
                      {asset.type === 'image' ? (
                        <img
                          src={asset.resultUrl}
                          alt="Generated image"
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <video
                          src={asset.resultUrl}
                          className="object-cover w-full h-full rounded-md"
                        />
                      )}
                      <div
                        className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full"
                        title={asset.type}>
                        {asset.type === 'image' ? (
                          <ImageIcon className="w-3 h-3 text-white" />
                        ) : (
                          <VideoCameraIcon className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-gray-200 truncate"
                        title={asset.prompt}>
                        {asset.prompt}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {asset.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
