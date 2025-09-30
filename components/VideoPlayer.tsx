/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
// FIX: The `Video` type does not exist, using `GeneratedVideo` instead.
import {GeneratedVideo} from '../types';
// FIX: The `PencilSquareIcon` component was not exported from `icons.tsx`.
import {PencilSquareIcon, XMarkIcon} from './icons';

interface VideoPlayerProps {
  video: GeneratedVideo;
  onClose: () => void;
  onEdit: (video: GeneratedVideo) => void;
}

/**
 * A component that renders a video player with controls, description, and edit button.
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onClose,
  onEdit,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog">
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 p-2 sm:p-4">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/70 hover:text-white z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            aria-label="Close video player">
            <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-md overflow-hidden">
            <video
              key={video.id}
              className="w-full h-full"
              // FIX: The `videoUrl` property does not exist on `GeneratedVideo`, using `resultUrl` instead.
              src={video.resultUrl}
              controls
              autoPlay
              loop
              // FIX: The `title` property does not exist on `GeneratedVideo`, using `prompt` instead.
              aria-label={video.prompt}
            />
          </div>
        </div>
        <div className="flex-1 p-4 pt-2 overflow-y-auto">
          <div className="flex justify-between items-start gap-4">
            <p className="text-sm text-gray-400 mt-0 whitespace-pre-wrap flex-1">
              {/* FIX: The `description` property does not exist on `GeneratedVideo`, using `prompt` instead. */}
              {video.prompt}
            </p>
            <button
              onClick={() => onEdit(video)}
              className="flex-shrink-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
              aria-label="Edit video details">
              <PencilSquareIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
