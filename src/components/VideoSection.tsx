import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [lastVolume, setLastVolume] = useState(0.5); // Сохраняем последнее значение громкости

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Устанавливаем начальное состояние Mute через JS
    video.muted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Видео видно - запускаем воспроизведение
            video.play().catch(() => {
              // Игнорируем ошибки автозапуска (браузеры могут блокировать)
            });
          } else {
            // Видео не видно - останавливаем
            video.pause();
          }
        });
      },
      {
        threshold: 0.5, // Запускаем когда 50% видео видно
        rootMargin: '0px'
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const currentlyMuted = !isMuted; // Новое состояние
    setIsMuted(currentlyMuted);
    video.muted = currentlyMuted;

    if (currentlyMuted) {
      // Если выключаем звук, сохраняем текущую громкость и ставим 0
      setLastVolume(volume);
      setVolume(0);
    } else {
      // Если включаем, восстанавливаем последнюю громкость (или ставим дефолтную)
      const newVolume = lastVolume > 0 ? lastVolume : 0.5;
      setVolume(newVolume);
      video.volume = newVolume;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    
    setVolume(newVolume);
    videoRef.current.volume = newVolume;

    if (newVolume > 0) {
      // Если громкость больше 0, видео не должно быть "заглушено"
      if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
      setLastVolume(newVolume);
    } else {
      // Если громкость 0, включаем "заглушение"
      if (!isMuted) {
        setIsMuted(true);
        videoRef.current.muted = true;
      }
    }
  };

  // Добавим стили прямо в компонент для адаптивности
  const volumeSliderStyles = `
    .volume-slider-vertical {
      width: 128px;
      height: 32px;
      cursor: pointer;
      background: transparent;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(-90deg);
      z-index: 10;
    }
    @media (max-width: 640px) {
      .volume-slider-vertical {
        width: 40px !important;
        height: 24px;
      }
      .volume-panel-mobile {
        min-width: 40px !important;
        max-width: 56px !important;
        padding: 8px !important;
      }
      .video-volume-gap {
        gap: 8px !important;
      }
    }
  `;

  return (
    <section className="py-20 px-4">
      <style>{volumeSliderStyles}</style>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Как мы работаем
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Посмотрите видео о том, как происходит выкуп автомобилей в нашей компании
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="flex w-full items-center justify-center gap-0 md:gap-8 video-volume-gap">
            {/* Видео строго по центру, прежний размер */}
            <div className="flex-1 flex justify-center">
              <div className="glass-card rounded-3xl p-4 aspect-video relative overflow-hidden w-full max-w-4xl mx-auto">
                {/* Локальное видео */}
                <video
                  ref={videoRef}
                  className="w-full h-full rounded-2xl shadow-2xl object-cover"
                  loop
                  preload="metadata"
                  poster="/videos/car_buyout_poster.jpg"
                  style={{
                    clipPath: 'inset(0 0 0 0 round 1rem)', // Закругленные края для видео
                  }}
                >
                  <source src="/videos/car_buyout.mp4" type="video/mp4" />
                  <p className="text-white text-center p-4">
                    Ваш браузер не поддерживает видео.
                  </p>
                </video>
              </div>
            </div>

            {/* Ползунок громкости */}
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 min-w-[80px] ml-0 md:ml-8 volume-panel-mobile">
              {/* Иконка звука */}
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

              {/* Ползунок громкости */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-8 h-32 mb-4 flex items-end justify-center">
                  {/* Фоновая дорожка */}
                  <div className="absolute inset-0 rounded-full opacity-80 border border-white/10 shadow-inner"
                       style={{ backgroundImage: 'repeating-linear-gradient(135deg, #232323 0 8px, #181818 8px 16px)' }}></div>
                  
                  {/* Активная часть */}
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-white rounded-full transition-all duration-75"
                    style={{ 
                      height: `${volume * 100}%`,
                    }}
                  ></div>
                  
                  {/* Вертикальный ползунок */}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider-vertical"
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
