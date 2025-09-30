/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type GenerationType = 'image' | 'video';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

// Image-specific types
export type ImageStyle =
  | 'Ultra Realistic'
  | 'Watercolor'
  | 'Pen Sketch'
  | 'Pencil Sketch';

// Video-specific types
export type VideoStyle = 'Cinematic' | 'Action' | 'Slow';
export type VideoDuration = 3 | 5 | 8; // in seconds

interface BaseAsset {
  id: string;
  type: GenerationType;
  sourceImage: {
    base64: string;
    mimeType: string;
  };
  prompt: string;
  aspectRatio: AspectRatio;
  createdAt: Date;
}

export interface GeneratedImage extends BaseAsset {
  type: 'image';
  style: ImageStyle;
  creativity: number; // 0-100
  styleStrength: number; // 0-100
  resultUrl: string; // base64 data URL
}

export interface GeneratedVideo extends BaseAsset {
  type: 'video';
  style: VideoStyle;
  duration: VideoDuration;
  resultUrl: string; // base64 data URL
}

export type Asset = GeneratedImage | GeneratedVideo;
