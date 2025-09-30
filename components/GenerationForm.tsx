/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useCallback, useRef, useState} from 'react';
import {
  ASPECT_RATIOS,
  IMAGE_STYLES,
  VIDEO_DURATIONS,
  VIDEO_STYLES,
} from '../constants';
import {
  AspectRatio,
  GenerationType,
  ImageStyle,
  VideoDuration,
  VideoStyle,
} from '../types';
import {ImageIcon, SparklesIcon, UploadIcon, VideoCameraIcon} from './icons';

interface GenerationFormProps {
  onGenerate: (
    generationType: GenerationType,
    sourceFile: File,
    prompt: string,
    options: {
      imageStyle: ImageStyle;
      creativity: number;
      styleStrength: number;
      videoStyle: VideoStyle;
      duration: VideoDuration;
      aspectRatio: AspectRatio;
    },
  ) => void;
  isApiConfigured: boolean;
}

export const GenerationForm: React.FC<GenerationFormProps> = ({
  onGenerate,
  isApiConfigured,
}) => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [generationType, setGenerationType] = useState<GenerationType>('image');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  // Image options
  const [imageStyle, setImageStyle] = useState<ImageStyle>('Ultra Realistic');
  const [creativity, setCreativity] = useState(50);
  const [styleStrength, setStyleStrength] = useState(75);

  // Video options
  const [videoStyle, setVideoStyle] = useState<VideoStyle>('Cinematic');
  const [duration, setDuration] = useState<VideoDuration>(5);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setSourceFile(file);
      setSourcePreview(URL.createObjectURL(file));
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceFile) {
      onGenerate(generationType, sourceFile, prompt, {
        imageStyle,
        creativity,
        styleStrength,
        videoStyle,
        duration,
        aspectRatio,
      });
    }
  };

  const FileUploader = () => (
    <div
      onDragEnter={handleDrag}
      className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800/80 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-400">
          <span className="font-semibold text-purple-400">Click to upload</span>{' '}
          or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          Sketch, photo, or low-quality render
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {dragActive && (
        <div
          className="absolute inset-0 w-full h-full"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}></div>
      )}
    </div>
  );

  const ImagePreviewer = () => (
    <div className="relative w-full h-64 rounded-lg overflow-hidden group">
      <img
        src={sourcePreview!}
        alt="Source preview"
        className="object-contain w-full h-full"
      />
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => {
            setSourceFile(null);
            setSourcePreview(null);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          Remove Image
        </button>
      </div>
    </div>
  );

  const Slider = ({label, value, onChange, helpText}: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-purple-500"
      />
      <p className="mt-1 text-xs text-gray-500">{helpText}</p>
    </div>
  );

  const Select = ({label, value, onChange, options}: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
        {options.map((opt: any) => (
          <option
            key={typeof opt === 'object' ? opt.value : opt}
            value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
    </div>
  );

  const RadioPills = ({label, value, onChange, options, icons}: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option: any) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              value === option
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}>
            {icons?.[option]}
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Upload */}
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Upload your design</h2>
          {sourcePreview ? <ImagePreviewer /> : <FileUploader />}
        </section>

        {sourceFile && (
          <div className="space-y-8 animate-fade-in">
            {/* Step 2: Choose Output */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. Choose your output
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGenerationType('image')}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all ${
                    generationType === 'image'
                      ? 'border-purple-500 bg-purple-900/20 shadow-lg'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}>
                  <ImageIcon className="w-8 h-8 mb-2 text-purple-400" />
                  <span className="font-semibold">Generate Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationType('video')}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all ${
                    generationType === 'video'
                      ? 'border-purple-500 bg-purple-900/20 shadow-lg'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}>
                  <VideoCameraIcon className="w-8 h-8 mb-2 text-purple-400" />
                  <span className="font-semibold">Generate Video</span>
                </button>
              </div>
            </section>

            {/* Step 3: Configure */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. Describe your vision
              </h2>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A modern villa at sunset, surrounded by palm trees, with a warm and inviting glow from the windows..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200"
              />

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {generationType === 'image' ? (
                  // Image Options
                  <>
                    <RadioPills
                      label="Style"
                      value={imageStyle}
                      onChange={setImageStyle}
                      options={IMAGE_STYLES}
                    />
                    <Select
                      label="Aspect Ratio"
                      value={aspectRatio}
                      onChange={setAspectRatio}
                      options={ASPECT_RATIOS}
                    />
                    <Slider
                      label="Creativity Level"
                      value={creativity}
                      onChange={setCreativity}
                      helpText="Higher values allow the AI more creative freedom."
                    />
                    <Slider
                      label="Style Strength"
                      value={styleStrength}
                      onChange={setStyleStrength}
                      helpText="How strongly the chosen style is applied."
                    />
                  </>
                ) : (
                  // Video Options
                  <>
                    <RadioPills
                      label="Style"
                      value={videoStyle}
                      onChange={setVideoStyle}
                      options={VIDEO_STYLES}
                    />
                    <Select
                      label="Aspect Ratio"
                      value={aspectRatio}
                      onChange={setAspectRatio}
                      options={ASPECT_RATIOS}
                    />
                    <Select
                      label="Duration"
                      value={duration}
                      // FIX: The return type of `parseInt` is `number`, which is not assignable to `VideoDuration`. Cast the value to the correct type.
                      onChange={(v: string) =>
                        setDuration(parseInt(v, 10) as VideoDuration)
                      }
                      options={VIDEO_DURATIONS}
                    />
                  </>
                )}
              </div>
            </section>

            {/* Step 4: Generate */}
            <section className="text-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!sourceFile || !prompt || !isApiConfigured}>
                <SparklesIcon className="w-5 h-5" />
                Bring to Life
              </button>
            </section>
          </div>
        )}
      </form>
    </div>
  );
};
