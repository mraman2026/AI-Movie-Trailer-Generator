import React, { useState, useRef } from 'react';
import { Film, Upload, Wand2, Play, Download, Pause } from 'lucide-react';

interface MovieData {
  title: string;
  description: string;
}

// Sample video URLs for different genres/themes with longer durations
const SAMPLE_VIDEOS = {
  action: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  drama: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  comedy: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  default: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
};

function App() {
  const [movieData, setMovieData] = useState<MovieData>({
    title: '',
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const determineVideoType = (title: string, description: string): string => {
    const input = (title + ' ' + description).toLowerCase();
    
    if (input.includes('action') || input.includes('adventure') || input.includes('fight') || input.includes('battle')) {
      return 'action';
    }
    if (input.includes('drama') || input.includes('emotional') || input.includes('serious')) {
      return 'drama';
    }
    if (input.includes('comedy') || input.includes('funny') || input.includes('humor')) {
      return 'comedy';
    }
    return 'default';
  };

  const handleGenerate = async () => {
    if (!movieData.title || !movieData.description) {
      setError('Please provide both title and description');
      return;
    }

    // Reset video state
    setPreviewUrl('');
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsGenerating(true);
    setError('');
    setGenerationProgress(0);

    // Simulate AI processing with progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate video generation based on input
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationProgress(100);
      const videoType = determineVideoType(movieData.title, movieData.description);
      // Add timestamp to URL to prevent caching
      const timestamp = new Date().getTime();
      setPreviewUrl(`${SAMPLE_VIDEOS[videoType]}?t=${timestamp}`);
      setIsGenerating(false);
    }, 5000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Playback error:', error);
            setError('Failed to play video. Please try again.');
            setIsPlaying(false);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (previewUrl) {
      const videoUrl = previewUrl.split('?')[0]; // Remove timestamp query parameter
      try {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `${movieData.title || 'movie'}-trailer.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        setError('Failed to download video. Please try again.');
      }
    }
  };

  const handleVideoError = () => {
    setError('Failed to load video. Please try generating again.');
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Film className="w-8 h-8 text-green-400" />
            <h1 className="text-2xl font-bold">AI Movie Trailer Generator</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Movie Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Movie Title</label>
                  <input
                    type="text"
                    value={movieData.title}
                    onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                    placeholder="Enter movie title (e.g., 'Epic Action Adventure')"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={movieData.description}
                    onChange={(e) => setMovieData({ ...movieData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none h-32"
                    placeholder="Enter movie description (e.g., 'An action-packed thriller with dramatic twists')"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Clips</span>
                  </button>
                  <input id="file-upload" type="file" className="hidden" multiple accept="video/*" />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-5 h-5" />
              <span>{isGenerating ? 'Generating...' : 'Generate Trailer'}</span>
            </button>

            {isGenerating && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Generating trailer...</span>
                  <span>{generationProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-300">
                {error}
              </div>
            )}
            {previewUrl ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    onEnded={() => setIsPlaying(false)}
                    onError={handleVideoError}
                  />
                  <button 
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-16 h-16" />
                    ) : (
                      <Play className="w-16 h-16" />
                    )}
                  </button>
                </div>
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold transition"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Trailer</span>
                </button>
              </div>
            ) : (
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Generated trailer will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;