import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  return (
    <section className="py-20 px-4">
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
          <div className="flex w-full items-center justify-center gap-0 md:gap-8">
            {/* Видео строго по центру, прежний размер */}
            <div className="flex-1 flex justify-center">
              <div className="glass-card rounded-3xl p-4 aspect-video relative overflow-hidden w-full max-w-4xl mx-auto">
                {/* Локальное видео */}
                <video
                  ref={videoRef}
                  className="w-full h-full rounded-2xl shadow-2xl object-cover"
                  muted
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
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 min-w-[80px] ml-0 md:ml-8">
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
                    style={{
                      width: '128px',
                      height: '32px',
                      cursor: 'pointer',
                      background: 'transparent',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%) rotate(-90deg)',
                      zIndex: 10
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
