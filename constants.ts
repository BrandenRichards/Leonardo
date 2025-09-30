/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  AspectRatio,
  ImageStyle,
  VideoDuration,
  VideoStyle,
} from './types';

export const IMAGE_STYLES: ImageStyle[] = [
  'Ultra Realistic',
  'Watercolor',
  'Pen Sketch',
  'Pencil Sketch',
];

export const VIDEO_STYLES: VideoStyle[] = [
  'Cinematic',
  'Action',
  'Slow',
];

export const ASPECT_RATIOS: AspectRatio[] = [
  '1:1',
  '16:9',
  '9:16',
  '4:3',
  '3:4',
];

export const VIDEO_DURATIONS: {label: string; value: VideoDuration}[] = [
  {label: 'Short (3s)', value: 3},
  {label: 'Medium (5s)', value: 5},
  {label: 'Long (8s)', value: 8},
];
