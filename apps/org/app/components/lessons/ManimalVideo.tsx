import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import Replay from '@mui/icons-material/Replay';
import Fullscreen from '@mui/icons-material/Fullscreen';
import VolumeOff from '@mui/icons-material/VolumeOff';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { useTheme } from '@mui/material/styles';

interface ManimalVideoProps {
  topic: 'linear_regression' | 'classification' | 'neural_network';
  sceneName: string;
  title: string;
  description?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  onVideoEnd?: () => void;
  onVideoStart?: () => void;
}

export function ManimalVideo({
  topic,
  sceneName,
  title,
  description,
  autoPlay = false,
  showControls = true,
  onVideoEnd,
  onVideoStart,
}: ManimalVideoProps) {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoSrc = `/visuals/${topic}/${sceneName}.mp4`;

  console.log('ManimalVideo - videoSrc:', videoSrc);
  console.log('ManimalVideo - isLoading:', isLoading);
  console.log('ManimalVideo - error:', error);

  useEffect(() => {
    console.log('ManimalVideo - Component mounted');
    console.log('ManimalVideo - videoRef.current:', videoRef.current);

    const video = videoRef.current;
    if (video) {
      console.log(
        'ManimalVideo - Video element ready state:',
        video.readyState
      );
      console.log(
        'ManimalVideo - Video element network state:',
        video.networkState
      );
      console.log('ManimalVideo - Video src:', video.src);
      console.log('ManimalVideo - Video current src:', video.currentSrc);

      // Add a timeout to force loading state off if it gets stuck
      const loadingTimeout = setTimeout(() => {
        console.log(
          'ManimalVideo - Loading timeout triggered, forcing loading off'
        );
        setIsLoading(false);
      }, 5000); // 5 second timeout

      // Clear timeout if video loads properly
      const handleLoad = () => {
        console.log('ManimalVideo - Video load event fired');
        clearTimeout(loadingTimeout);
      };

      video.addEventListener('loadedmetadata', handleLoad);
      video.addEventListener('loadeddata', handleLoad);
      video.addEventListener('canplay', handleLoad);

      return () => {
        clearTimeout(loadingTimeout);
        video.removeEventListener('loadedmetadata', handleLoad);
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('canplay', handleLoad);
      };
    }
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      onVideoStart?.();
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    videoRef.current.play();
    onVideoStart?.();
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;

    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    console.log('ManimalVideo - handleLoadedMetadata called');
    console.log('ManimalVideo - duration:', videoRef.current.duration);
    setDuration(videoRef.current.duration);
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onVideoEnd?.();
  };

  const handleError = (event: any) => {
    console.log('ManimalVideo - handleError called');
    console.log('ManimalVideo - error event:', event);
    console.log(
      'ManimalVideo - videoRef.current?.error:',
      videoRef.current?.error
    );
    setError(
      "Video is being generated. For now, here's a preview of what you'll see!"
    );
    setIsLoading(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <Card
        elevation={0}
        sx={{
          background: theme.palette.glass.card,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.glass.border}`,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            🎬 {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Box
            sx={{
              p: 4,
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              border: `2px dashed ${theme.palette.primary.main}`,
              mb: 2,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              🎭
            </Typography>
            <Typography variant="body2" color="warning.main">
              {error}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Run the Manim generation script to create the actual video!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        background: theme.palette.glass.card,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.glass.border}`,
        borderRadius: 3,
        mb: 3,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Video Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Chip
              label="Manim Animation"
              size="small"
              sx={{
                background: theme.palette.gradients.primary,
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Typography variant="h6" color="primary" fontWeight={600}>
              {title}
            </Typography>
          </Stack>

          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, mb: 1 }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* Video Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            backgroundColor: 'black',
            borderRadius: showControls ? 0 : 3,
          }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay={autoPlay}
            muted={isMuted}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onLoadedData={() => {
              console.log('ManimalVideo - onLoadedData called');
              if (videoRef.current) {
                console.log(
                  'ManimalVideo - onLoadedData duration:',
                  videoRef.current.duration
                );
                setDuration(videoRef.current.duration);
                setIsLoading(false);
              }
            }}
            onCanPlay={() => {
              console.log('ManimalVideo - onCanPlay called');
              if (videoRef.current) {
                console.log(
                  'ManimalVideo - onCanPlay duration:',
                  videoRef.current.duration
                );
                setDuration(videoRef.current.duration);
                setIsLoading(false);
              }
            }}
            onEnded={handleEnded}
            onError={handleError}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              <Typography color="white">Loading animation...</Typography>
            </Box>
          )}

          {/* Play Button Overlay */}
          {!isPlaying && !isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
              }}
              onClick={handlePlayPause}
            >
              <IconButton
                size="large"
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'primary.main',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <PlayArrow sx={{ fontSize: 48 }} />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Controls */}
        {showControls && (
          <Box sx={{ p: 2, pt: 1 }}>
            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mb: 2,
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.glass.border,
                '& .MuiLinearProgress-bar': {
                  background: theme.palette.gradients.primary,
                },
              }}
            />

            {/* Control Buttons */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                onClick={handlePlayPause}
                disabled={isLoading}
                sx={{ color: 'primary.main' }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>

              <IconButton
                onClick={handleReplay}
                disabled={isLoading}
                sx={{ color: 'primary.main' }}
              >
                <Replay />
              </IconButton>

              <IconButton
                onClick={handleMute}
                disabled={isLoading}
                sx={{ color: 'primary.main' }}
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>

              <IconButton
                onClick={handleFullscreen}
                disabled={isLoading}
                sx={{ color: 'primary.main' }}
              >
                <Fullscreen />
              </IconButton>

              <Box sx={{ flex: 1 }} />

              <Typography variant="body2" color="text.secondary">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
