
import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Посмотрите, как мы <span className="text-neon-orange text-neon-glow">работаем</span>
          </h2>
          <p className="text-xl text-gray-600">
            Реальные отзывы клиентов и процесс выкупа автомобилей
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden group hover:border-neon-orange/50 transition-all duration-500 shadow-lg">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex p-6 bg-neon-red/20 rounded-full border border-neon-red/50 shadow-neon-red group-hover:shadow-neon-red/50 transition-all duration-300 cursor-pointer hover:scale-110">
                <Play className="h-12 w-12 text-neon-red fill-current" />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Видео скоро появится</h3>
                <p className="text-gray-600">Мы готовим для вас интересный контент</p>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-neon-green mb-2">1000+</div>
            <p className="text-gray-600">Довольных клиентов</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-neon-orange mb-2">24/7</div>
            <p className="text-gray-600">Работаем круглосуточно</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-neon-red mb-2">30 мин</div>
            <p className="text-gray-600">Среднее время сделки</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
