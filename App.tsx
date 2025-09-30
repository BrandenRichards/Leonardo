/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  GoogleGenAI,
  Modality,
  GenerateContentResponse,
  Operation,
} from '@google/genai';
import React, {useState} from 'react';
import {ErrorModal} from './components/ErrorModal';
import {GenerationForm} from './components/GenerationForm';
import {HistoryPanel} from './components/HistoryPanel';
import {HomeIcon} from './components/icons';
import {LoadingOverlay} from './components/SavingProgressPage';
import {PasswordPage} from './components/PasswordPage';
import {ResultViewer} from './components/ResultViewer';
import {
  Asset,
  AspectRatio,
  GeneratedImage,
  GeneratedVideo,
  GenerationType,
  ImageStyle,
  VideoDuration,
  VideoStyle,
} from './types';

const VEO_MODEL = 'veo-2.0-generate-001';
const IMAGE_EDIT_MODEL = 'gemini-2.5-flash-image-preview';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const IS_API_KEY_CONFIGURED = !!process.env.API_KEY;

// --- Helper Functions ---

async function fileToBase64(file: File): Promise<{
  base64: string;
  mimeType: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({base64, mimeType: file.type});
    };
    reader.onerror = (error) => reject(error);
  });
}

// --- API Calls ---

async function generateVideo(
  prompt: string,
  image: {base64: string; mimeType: string},
  aspectRatio: AspectRatio,
): Promise<string> {
  let operation: Operation = await ai.models.generateVideos({
    model: VEO_MODEL,
    prompt,
    image: {
      imageBytes: image.base64,
      mimeType: image.mimeType,
    },
    config: {
      numberOfVideos: 1,
      aspectRatio,
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation});
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error('Video generation failed to return a valid URI.');
  }

  // FIX: The video URI from the API response is URL-encoded. It must be decoded before use.
  const url = decodeURIComponent(videoUri);
  const res = await fetch(`${url}&key=${process.env.API_KEY}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch video: ${res.status} ${res.statusText}`);
  }
  const blob = await res.blob();
  const reader = new FileReader();
  return new Promise<string>((resolve) => {
    reader.onload = () => {
      resolve((reader.result as string).split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
}

async function generateImage(
  prompt: string,
  image: {base64: string; mimeType: string},
): Promise<string> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: IMAGE_EDIT_MODEL,
    contents: {
      parts: [
        {
          inlineData: {
            data: image.base64,
            mimeType: image.mimeType,
          },
        },
        {text: prompt},
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error('Image generation failed to return an image.');
}

// --- Main App Component ---

export const App: React.FC = () => {
  // UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);

  // History State
  const [history, setHistory] = useState<Asset[]>([]);

  const handleGenerate = async (
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
  ) => {
    setIsGenerating(true);
    setError(null);
    try {
      const sourceImage = await fileToBase64(sourceFile);
      let newAsset: Asset | null = null;

      if (generationType === 'image') {
        const fullPrompt = `${options.imageStyle} architectural render of this building, with a creativity level of ${options.creativity} and style strength of ${options.styleStrength}. ${prompt}`;
        const imageB64 = await generateImage(fullPrompt, sourceImage);
        newAsset = {
          id: self.crypto.randomUUID(),
          type: 'image',
          sourceImage,
          prompt,
          style: options.imageStyle,
          creativity: options.creativity,
          styleStrength: options.styleStrength,
          aspectRatio: options.aspectRatio,
          resultUrl: `data:image/jpeg;base64,${imageB64}`,
          createdAt: new Date(),
        } as GeneratedImage;
      } else {
        // Video
        const fullPrompt = `A ${options.videoStyle.toLowerCase()} video of this building. ${prompt}`;
        const videoB64 = await generateVideo(
          fullPrompt,
          sourceImage,
          options.aspectRatio,
        );
        newAsset = {
          id: self.crypto.randomUUID(),
          type: 'video',
          sourceImage,
          prompt,
          style: options.videoStyle,
          duration: options.duration,
          aspectRatio: options.aspectRatio,
          resultUrl: `data:video/mp4;base64,${videoB64}`,
          createdAt: new Date(),
        } as GeneratedVideo;
      }

      setHistory((prev) => [newAsset, ...prev]);
      setActiveAsset(newAsset);
    } catch (e: unknown) {
      console.error(e);
      let errorMessage =
        e instanceof Error ? e.message : 'An unknown error occurred.';
      // Check for common API key error messages
      if (
        typeof errorMessage === 'string' &&
        (errorMessage.includes('API_KEY') ||
          errorMessage.toLowerCase().includes('api key'))
      ) {
        errorMessage =
          'Could not connect to the API. Please ensure the API key is correctly configured in the deployment environment and try again.';
      }
      setError(`Generation failed: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async (
    asset: Asset,
    positivePrompt: string,
    negativePrompt: string,
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      let editedAsset: Asset | null = null;
      const editPrompt = `${positivePrompt}. Do not include: ${negativePrompt}.`;

      if (asset.type === 'image') {
        // Use the generated image as the new source for editing
        const response = await fetch(asset.resultUrl);
        const blob = await response.blob();
        const file = new File([blob], 'edit-source.jpg', {type: 'image/jpeg'});
        const sourceImage = await fileToBase64(file);

        const imageB64 = await generateImage(editPrompt, sourceImage);
        editedAsset = {
          ...(asset as GeneratedImage),
          id: self.crypto.randomUUID(),
          prompt: `${asset.prompt}\n\nEdit: ${editPrompt}`,
          resultUrl: `data:image/jpeg;base64,${imageB64}`,
          createdAt: new Date(),
        };
      } else {
        // For video, re-generate from the original source image with a modified prompt
        const fullPrompt = `A ${
          (asset as GeneratedVideo).style
        } video of this building. ${asset.prompt}. Additional instructions: ${editPrompt}`;
        const videoB64 = await generateVideo(
          fullPrompt,
          asset.sourceImage,
          asset.aspectRatio,
        );
        editedAsset = {
          ...(asset as GeneratedVideo),
          id: self.crypto.randomUUID(),
          prompt: fullPrompt,
          resultUrl: `data:video/mp4;base64,${videoB64}`,
          createdAt: new Date(),
        };
      }

      setHistory((prev) => [editedAsset, ...prev]);
      setActiveAsset(editedAsset);
    } catch (e: unknown) {
      console.error(e);
      let errorMessage =
        e instanceof Error ? e.message : 'An unknown error occurred.';
      // Check for common API key error messages
      if (
        typeof errorMessage === 'string' &&
        (errorMessage.includes('API_KEY') ||
          errorMessage.toLowerCase().includes('api key'))
      ) {
        errorMessage =
          'Could not connect to the API. Please ensure the API key is correctly configured in the deployment environment and try again.';
      }
      setError(`Editing failed: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistoryItem = (assetId: string) => {
    const asset = history.find((a) => a.id === assetId);
    if (asset) {
      setActiveAsset(asset);
    }
  };

  const handleBackToStudio = () => {
    setActiveAsset(null);
  };

  const handleUnlock = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <PasswordPage onUnlock={handleUnlock} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 shadow-lg z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <HomeIcon className="w-8 h-8 text-purple-400" />
              <h1 className="text-xl font-semibold text-white tracking-wide">
                Leonardo{' '}
                <span className="font-light text-gray-400">
                  by Lake and Land Studio
                </span>
              </h1>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {!IS_API_KEY_CONFIGURED && (
            <div
              className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6"
              role="alert">
              <strong className="font-bold">Configuration Error!</strong>
              <span className="block sm:inline ml-2">
                {' '}
                The application is missing a required API key. Generation
                features are disabled.
              </span>
            </div>
          )}
          {activeAsset ? (
            <ResultViewer
              asset={activeAsset}
              onEdit={handleEdit}
              onBack={handleBackToStudio}
              isApiConfigured={IS_API_KEY_CONFIGURED}
            />
          ) : (
            <GenerationForm
              onGenerate={handleGenerate}
              isApiConfigured={IS_API_KEY_CONFIGURED}
            />
          )}
        </main>

        {/* History Panel */}
        <aside className="w-72 flex-shrink-0 border-l border-gray-700/50 bg-gray-800/30 hidden md:block">
          <HistoryPanel
            history={history}
            onSelect={handleSelectHistoryItem}
            activeAssetId={activeAsset?.id}
          />
        </aside>
      </div>

      {isGenerating && <LoadingOverlay />}

      {error && (
        <ErrorModal message={[error]} onClose={() => setError(null)} />
      )}
    </div>
  );
};
