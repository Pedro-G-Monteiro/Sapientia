'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  FullscreenOutlined,
  SettingOutlined,
  ExpandOutlined,
  CompressOutlined,
  FastForwardOutlined,
  FastBackwardOutlined,
  FlagOutlined
} from '@ant-design/icons';
import { Slider, Button, Dropdown, Menu, Tooltip, message } from 'antd';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
  onProgressUpdate?: (progress: number) => void;
  onComplete?: () => void;
  savedTime?: number; // Tempo salvo para continuar de onde parou
}

interface Bookmark {
  id: string;
  time: number;
  label: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  poster,
  onProgressUpdate,
  onComplete,
  savedTime = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState<TimeRanges | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Inicializar o vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
      
      // Iniciar do tempo salvo, se existir
      if (savedTime > 0 && savedTime < video.duration) {
        video.currentTime = savedTime;
        setCurrentTime(savedTime);
      }
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setBuffered(video.buffered);
      
      // Rastrear progresso
      if (onProgressUpdate) {
        const progress = (video.currentTime / video.duration) * 100;
        onProgressUpdate(progress);
      }
      
      // Verificar se o vídeo foi concluído
      if (video.currentTime >= video.duration * 0.9 && onComplete) {
        onComplete();
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };
    
    // Adicionar event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgressUpdate, onComplete, savedTime]);
  
  // Controlar a exibição dos controles
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      // Reset any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Hide controls after 3 seconds of inactivity
      timeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseMove);
      container.addEventListener('mouseleave', () => {
        if (isPlaying) setShowControls(false);
      });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseMove);
        container.removeEventListener('mouseleave', () => {
          if (isPlaying) setShowControls(false);
        });
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying]);
  
  // Função para alternar play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('Error playing video:', err);
        message.error('Failed to play video. Please try again.');
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Buscar para um tempo específico
  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  };
  
  // Atualizar tempo quando o slider for movido
  const handleProgressChange = (value: number) => {
    const newTime = (value / 100) * duration;
    seekTo(newTime);
  };
  
  // Alternar fullscreen
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Detectar alterações no estado de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Avançar/retroceder 10 segundos
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(video.currentTime + 10, duration);
    seekTo(newTime);
  };
  
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(video.currentTime - 10, 0);
    seekTo(newTime);
  };
  
  // Adicionar um marcador na posição atual
  const addBookmark = () => {
    const time = currentTime;
    const label = `Bookmark at ${formatTime(time)}`;
    
    const newBookmark = {
      id: `bookmark-${Date.now()}`,
      time,
      label
    };
    
    setBookmarks(prev => [...prev, newBookmark]);
    message.success('Bookmark added');
  };
  
  // Formatar o tempo em MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Opções de velocidade
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  
  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };
  
  // Renderizar o menu de velocidade
  const speedMenu = (
    <Menu
      items={speedOptions.map(rate => ({
        key: rate.toString(),
        label: `${rate}x`,
        onClick: () => changePlaybackRate(rate),
        className: rate === playbackRate ? styles.activeMenuItem : ''
      }))}
    />
  );
  
  // Renderizar o menu de marcadores
  const bookmarksMenu = (
    <Menu
      items={[
        {
          key: 'add',
          label: 'Add Bookmark',
          icon: <FlagOutlined />,
          onClick: addBookmark
        },
        ...bookmarks.map(bookmark => ({
          key: bookmark.id,
          label: bookmark.label,
          onClick: () => seekTo(bookmark.time)
        }))
      ]}
    />
  );
  
  return (
    <div 
      className={styles.videoPlayerContainer} 
      ref={containerRef}
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className={styles.videoElement}
        onClick={togglePlay}
        playsInline
      />
      
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
        </div>
      )}
      
      {/* Overlay central para play/pause com clique */}
      <div 
        className={styles.clickOverlay} 
        onClick={togglePlay}
      />
      
      {/* Controles de vídeo */}
      <div className={`${styles.controls} ${showControls ? styles.visible : ''}`}>
        {/* Barra de progresso */}
        <div className={styles.progressContainer} ref={progressBarRef}>
          {/* Buffer indicator */}
          {buffered && (
            <div className={styles.bufferBar}>
              {Array.from({ length: buffered.length }).map((_, i) => (
                <div
                  key={i}
                  className={styles.bufferSegment}
                  style={{
                    left: `${(buffered.start(i) / duration) * 100}%`,
                    width: `${((buffered.end(i) - buffered.start(i)) / duration) * 100}%`
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Marcadores na barra de progresso */}
          {bookmarks.map(bookmark => (
            <div
              key={bookmark.id}
              className={styles.bookmarkMarker}
              style={{
                left: `${(bookmark.time / duration) * 100}%`
              }}
              title={bookmark.label}
            />
          ))}
          
          <Slider
            className={styles.progressBar}
            value={(currentTime / duration) * 100 || 0}
            onChange={handleProgressChange}
            tooltip={{ formatter: (value) => formatTime((value! / 100) * duration) }}
          />
        </div>
        
        {/* Controles inferiores */}
        <div className={styles.controlsBottom}>
          <div className={styles.leftControls}>
            <Button 
              type="text" 
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlay}
              className={styles.controlButton}
            />
            
            <Button
              type="text"
              icon={<FastBackwardOutlined />}
              onClick={skipBackward}
              className={styles.controlButton}
            >
              10s
            </Button>
            
            <Button
              type="text"
              icon={<FastForwardOutlined />}
              onClick={skipForward}
              className={styles.controlButton}
            >
              10s
            </Button>
            
            <div className={styles.timeDisplay}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className={styles.rightControls}>
            <Dropdown overlay={bookmarksMenu} trigger={['click']}>
              <Button
                type="text"
                icon={<FlagOutlined />}
                className={styles.controlButton}
              />
            </Dropdown>
            
            <Dropdown overlay={speedMenu} trigger={['click']}>
              <Button
                type="text"
                className={styles.controlButton}
              >
                {playbackRate}x
              </Button>
            </Dropdown>
            
            <Button
              type="text"
              icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={toggleFullscreen}
              className={styles.controlButton}
            />
          </div>
        </div>
      </div>
      
      {/* Overlay de título */}
      {showControls && (
        <div className={styles.titleOverlay}>
          <h3>{title}</h3>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;