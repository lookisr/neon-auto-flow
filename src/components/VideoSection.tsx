import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);

  // Инициализация видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Устанавливаем начальное состояние
    video.muted = true;
    video.playsInline = true;

    const playVideo = () => {
      if (!video.paused) return;
      
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Autoplay prevented:', error);
        setIsPlaying(false);
      });
    };

    const pauseVideo = () => {
      if (video.paused) return;
      
      video.pause();
      setIsPlaying(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            pauseVideo();
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px'
      }
    );

    observer.observe(video);

    // Обработчик для мобильных устройств
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // Предотвращаем двойное срабатывание
      
      if (video.paused) {
        playVideo();
      } else {
        // Если видео воспроизводится, переключаем звук
        const newMutedState = !video.muted;
        video.muted = newMutedState;
        setIsMuted(newMutedState);
        
        if (!newMutedState) {
          video.volume = lastVolume;
          setVolume(lastVolume);
        } else {
          setLastVolume(video.volume);
          setVolume(0);
        }
      }
    };

    video.addEventListener('touchstart', handleTouchStart);

    return () => {
      observer.disconnect();
      video.removeEventListener('touchstart', handleTouchStart);
    };
  }, [lastVolume]); // Добавляем lastVolume в зависимости

  // Обработчики для ползунка громкости
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    updateVolumeFromMousePosition(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    updateVolumeFromMousePosition(e);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const updateVolumeFromMousePosition = (e: MouseEvent | React.MouseEvent) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const height = rect.height;
    const y = e.clientY - rect.top;
    
    let newVolume = 1 - (Math.max(0, Math.min(y, height)) / height);
    newVolume = Math.max(0, Math.min(1, newVolume));
    
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0) {
        setIsMuted(false);
        videoRef.current.muted = false;
        setLastVolume(newVolume);
      } else {
        setIsMuted(true);
        videoRef.current.muted = true;
      }
    }
  };

  // Обработчики событий мыши
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const currentlyMuted = !isMuted;
    setIsMuted(currentlyMuted);
    video.muted = currentlyMuted;

    if (currentlyMuted) {
      setLastVolume(volume);
      setVolume(0);
      video.volume = 0;
    } else {
      const newVolume = lastVolume > 0 ? lastVolume : 0.5;
      setVolume(newVolume);
      video.volume = newVolume;
    }
  };

  const volumeSliderStyles = `
    .volume-slider-container {
      position: relative;
      width: 32px;
      height: 128px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      padding: 8px 0;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .volume-slider-track {
      position: absolute;
      top: 8px;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      cursor: pointer;
    }

    .volume-slider-fill {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 2px;
      transition: height 0.1s ease;
    }

    .volume-slider-thumb {
      position: absolute;
      left: 50%;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transform: translate(-50%, 50%);
      transition: transform 0.1s ease;
      cursor: pointer;
      z-index: 2;
    }

    .volume-slider-thumb:hover,
    .volume-slider-thumb:active {
      transform: translate(-50%, 50%) scale(1.1);
    }
  `;

  return (
    <section className="py-20 px-4">
      <style>{volumeSliderStyles}</style>
      <div className="container mx-auto w-full max-w-6xl px-0">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Как мы работаем
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Посмотрите видео о том, как происходит выкуп автомобилей в нашей компании
          </p>
        </div>
        
        <div className="relative w-full sm:max-w-4xl mx-auto">
          <div className="flex w-full items-center justify-center gap-0 md:gap-8 video-volume-gap">
            <div className="flex-1 flex justify-center">
              <div className="glass-card rounded-2xl sm:rounded-3xl p-1 sm:p-4 aspect-video relative overflow-hidden w-full mx-auto">
                <video
                  ref={videoRef}
                  className="w-full h-full rounded-lg sm:rounded-2xl shadow-2xl object-cover"
                  loop
                  playsInline
                  muted
                  preload="metadata"
                  poster="/videos/car_buyout_poster.jpg"
                  style={{
                    clipPath: 'inset(0 0 0 0 round 0.75rem)',
                  }}
                >
                  <source src="/videos/car_buyout.mp4" type="video/mp4" />
                  <p className="text-white text-center p-4">
                    Ваш браузер не поддерживает видео.
                  </p>
                </video>
                
                {/* Оверлей для мобильных устройств */}
                <div 
                  className="absolute inset-0 md:hidden flex items-center justify-center bg-black/20 backdrop-blur-sm"
                  style={{ display: isPlaying ? 'none' : 'flex' }}
                >
                  <div className="text-white text-center">
                    <p className="text-lg font-medium mb-2">Нажмите для воспроизведения</p>
                    <p className="text-sm opacity-75">Коснитесь для управления звуком</p>
                  </div>
                </div>

                {/* Индикатор звука для мобильных */}
                <div 
                  className="absolute bottom-4 right-4 md:hidden"
                  style={{ display: isPlaying ? 'block' : 'none' }}
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6 text-white opacity-75" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-white opacity-75" />
                  )}
                </div>
              </div>
            </div>

            {/* Ползунок громкости только для десктопов */}
            <div className="glass-card rounded-2xl p-6 hidden md:flex flex-col items-center gap-4 min-w-[80px] ml-0 md:ml-8">
              <button
                onClick={toggleMute}
                className="glass-card p-3 rounded-full border border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
              >
                {isMuted ? (
                  <VolumeX className="h-6 w-6 text-white group-hover:text-[#ff3333] transition-colors" />
                ) : (
                  <Volume2 className="h-6 w-6 text-white group-hover:text-[#ff3333] transition-colors" />
                )}
              </button>

              <div className="volume-slider-container">
                <div 
                  ref={sliderRef}
                  className="volume-slider-track"
                  onMouseDown={handleMouseDown}
                >
                  <div 
                    className="volume-slider-fill"
                    style={{ 
                      height: `${volume * 100}%`
                    }}
                  />
                  <div 
                    className="volume-slider-thumb"
                    style={{ 
                      bottom: `${volume * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
