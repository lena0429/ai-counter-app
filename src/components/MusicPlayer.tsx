import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

interface MusicPlayerProps {
  isRunning: boolean;
  onTimerComplete?: () => void;
}

interface AudioTrack {
  id: string;
  name: string;
  file: File;
  url: string;
  duration: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isRunning, onTimerComplete }) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(64));

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Initialize audio context for visualization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const context = new AudioContextClass();
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 128;
        setAudioContext(context);
        setAnalyser(analyserNode);
      }
    }
  }, []);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newTracks: AudioTrack[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const track: AudioTrack = {
          id: Date.now().toString() + Math.random(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          file,
          url,
          duration: 0
        };
        newTracks.push(track);
      }
    });

    setTracks(prev => [...prev, ...newTracks]);
    
    // Auto-play first track if no tracks were playing
    if (tracks.length === 0 && newTracks.length > 0) {
      setCurrentTrackIndex(0);
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current || tracks.length === 0) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle next track
  const nextTrack = () => {
    if (tracks.length === 0) return;
    
    let nextIndex;
    if (isShuffling) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    setCurrentTrackIndex(nextIndex);
  };

  // Handle previous track
  const prevTrack = () => {
    if (tracks.length === 0) return;
    
    let prevIndex;
    if (isShuffling) {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    }
    setCurrentTrackIndex(prevIndex);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && tracks[currentTrackIndex]) {
      const track = tracks[currentTrackIndex];
      track.duration = audioRef.current.duration;
      setTracks(prev => [...prev]);
    }
  };

  const handleEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextTrack();
    }
  };

  // Audio visualization
  useEffect(() => {
    if (!analyser || !audioRef.current || !isPlaying) return;

    const updateVisualization = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      setFrequencyData(dataArray);
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isPlaying]);

  // Connect audio to analyser when track changes
  useEffect(() => {
    if (audioRef.current && audioContext && analyser && tracks[currentTrackIndex]) {
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }
  }, [currentTrackIndex, tracks, audioContext, analyser]);

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="music-player">
      {/* File Upload */}
      <div className="upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileUpload}
          className="file-input"
          id="audio-upload"
        />
        <label htmlFor="audio-upload" className="upload-btn">
          <span className="upload-icon">🎵</span>
          <span>Upload Music</span>
        </label>
      </div>

      {/* Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Player Controls */}
      {tracks.length > 0 && (
        <div className="player-controls">
          {/* Track Info */}
          <div className="track-info">
            <h3 className="track-name">{currentTrack?.name || 'No track selected'}</h3>
            <p className="track-time">
              {formatTime(currentTime)} / {formatTime(currentTrack?.duration || 0)}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <input
              type="range"
              min="0"
              max={currentTrack?.duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="progress-bar"
            />
          </div>

          {/* Control Buttons */}
          <div className="control-buttons">
            <button onClick={prevTrack} className="control-btn" disabled={tracks.length <= 1}>
              ⏮️
            </button>
            <button onClick={togglePlay} className="control-btn play-btn">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={nextTrack} className="control-btn" disabled={tracks.length <= 1}>
              ⏭️
            </button>
          </div>

          {/* Volume and Settings */}
          <div className="volume-settings">
            <div className="volume-control">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            <div className="playback-settings">
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`setting-btn ${isLooping ? 'active' : ''}`}
                title="Loop"
              >
                🔄
              </button>
              <button
                onClick={() => setIsShuffling(!isShuffling)}
                className={`setting-btn ${isShuffling ? 'active' : ''}`}
                title="Shuffle"
              >
                🔀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Visualization */}
      {isPlaying && (
        <div className="visualization">
          <div className="visualization-bars">
            {Array.from(frequencyData).slice(0, 32).map((value, index) => (
              <div
                key={index}
                className="visualization-bar"
                style={{
                  height: `${(value / 255) * 100}%`,
                  backgroundColor: `hsl(${200 + (value / 255) * 60}, 70%, 60%)`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Playlist */}
      {tracks.length > 0 && (
        <div className="playlist">
          <h4>Playlist ({tracks.length} tracks)</h4>
          <div className="playlist-tracks">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`playlist-track ${index === currentTrackIndex ? 'active' : ''}`}
                onClick={() => setCurrentTrackIndex(index)}
              >
                <span className="track-number">{index + 1}</span>
                <span className="track-title">{track.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTracks(prev => prev.filter((_, i) => i !== index));
                    if (index === currentTrackIndex && tracks.length > 1) {
                      setCurrentTrackIndex(Math.max(0, index - 1));
                    }
                  }}
                  className="remove-track"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer; 