/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
// FIX: The `Video` type does not exist, using `GeneratedVideo` instead.
import {GeneratedVideo} from '../types';
// FIX: The `PlayIcon` component was not exported from `icons.tsx`.
import {PlayIcon} from './icons';

interface VideoCardProps {
  video: GeneratedVideo;
  onPlay: (video: GeneratedVideo) => void;
}

/**
 * A component that renders a video card with a thumbnail, title, and play button.
 */
export const VideoCard: React.FC<VideoCardProps> = ({video, onPlay}) => {
  return (
    <button
      type="button"
      className="group w-full text-left bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-gray-500/30 transform transition-all duration-300 hover:-translate-y-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
      onClick={() => onPlay(video)}
      // FIX: The `title` property does not exist on `GeneratedVideo`, using `prompt` instead.
      aria-label={`Play video: ${video.prompt}`}>
      <div className="relative">
        <video
          className="w-full h-48 object-cover pointer-events-none"
          // FIX: The `videoUrl` property does not exist on `GeneratedVideo`, using `resultUrl` instead.
          src={video.resultUrl}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"></video>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayIcon className="w-16 h-16 text-white opacity-80 drop-shadow-lg group-hover:opacity-100 transform group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="p-4">
        <h3
          className="text-base font-semibold text-gray-200 truncate"
          // FIX: The `title` property does not exist on `GeneratedVideo`, using `prompt` instead.
          title={video.prompt}>
          {video.prompt}
        </h3>
      </div>
    </button>
  );
};
