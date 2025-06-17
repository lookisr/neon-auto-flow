
import { useState } from "react";
import Navigation from "@/components/Navigation";
import LeadGeneratorCard from "@/components/LeadGeneratorCard";
import VideoSection from "@/components/VideoSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import KoreaCarWizard from "@/components/KoreaCarWizard";
import ListingsPage from "@/components/ListingsPage";

const Index = () => {
  const [isKoreaWizardOpen, setIsKoreaWizardOpen] = useState(false);
  const [isListingsOpen, setIsListingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation 
        onKoreaClick={() => setIsKoreaWizardOpen(true)}
        onListingsClick={() => setIsListingsOpen(true)}
      />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Продайте авто
              <span className="block text-red-500">
                ДОРОГО
              </span>
              <span className="block text-3xl md:text-5xl mt-4 text-gray-600">
                и быстро
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Выкупаем любые автомобили по максимальной цене. 
              Оценка за 5 минут, деньги сразу на руки.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <LeadGeneratorCard />
          </div>
        </div>
      </section>

      <VideoSection />
      <HowItWorksSection />
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex p-4 bg-green-50 rounded-full border border-green-200 mb-6 group-hover:border-green-300 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  ✓
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Гарантия лучшей цены</h3>
              <p className="text-gray-600">
                Предложим цену выше рыночной или найдем того, кто предложит больше
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex p-4 bg-orange-50 rounded-full border border-orange-200 mb-6 group-hover:border-orange-300 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  🚗
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Авто из Кореи</h3>
              <p className="text-gray-600">
                Прямые поставки качественных автомобилей с аукционов Кореи
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex p-4 bg-red-50 rounded-full border border-red-200 mb-6 group-hover:border-red-300 transition-all duration-300">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  ⚡
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Срочный выкуп</h3>
              <p className="text-gray-600">
                Деньги в день обращения. Работаем 24/7, выезжаем в любую точку города
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-gray-100 to-white py-12 px-4 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4">
              <span className="text-orange-500">AUTO</span>
              <span className="text-gray-900">PRO</span>
            </div>
            <p className="text-gray-600 mb-6">
              Профессиональный выкуп автомобилей и продажа авто из Кореи
            </p>
            <div className="flex justify-center space-x-6 text-gray-600">
              <span>+7 (999) 123-45-67</span>
              <span>•</span>
              <span>info@autopro.ru</span>
              <span>•</span>
              <span>Москва, ул. Примерная, 123</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <KoreaCarWizard 
        isOpen={isKoreaWizardOpen}
        onClose={() => setIsKoreaWizardOpen(false)}
      />
      
      <ListingsPage 
        isOpen={isListingsOpen}
        onClose={() => setIsListingsOpen(false)}
      />
    </div>
  );
};

export default Index;
