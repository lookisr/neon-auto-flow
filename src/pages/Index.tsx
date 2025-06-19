import { useState } from "react";
import Navigation from "@/components/Navigation";
import LeadGeneratorCard from "@/components/LeadGeneratorCard";
import VideoSection from "@/components/VideoSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import KoreaCarWizard from "@/components/KoreaCarWizard";
import ListingsPage from "@/components/ListingsPage";
import ReviewsSection from "@/components/ReviewsSection";
import { COMPANY_PHONE, COMPANY_PHONE_DISPLAY, COMPANY_EMAIL, COMPANY_ADDRESS, COMPANY_NAME } from "@/config/constants";

const Index = () => {
  const [isKoreaWizardOpen, setIsKoreaWizardOpen] = useState(false);
  const [isListingsOpen, setIsListingsOpen] = useState(false);

  // Если открыта страница объявлений, показываем только её
  if (isListingsOpen) {
    return (
      <ListingsPage 
        isOpen={isListingsOpen}
        onClose={() => setIsListingsOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen text-white relative z-10">
      <Navigation 
        onKoreaClick={() => setIsKoreaWizardOpen(true)}
        onListingsClick={() => setIsListingsOpen(true)}
      />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            {/* Новый логотип */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 magma-animated-text animate-magma">
                КПС-АВТО
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full animate-pulse-slow shadow-lg"></div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white-glow">
              Продайте авто
              <span className="block text-magma-glow text-orange-400">
                ДОРОГО
              </span>
              <span className="block text-2xl md:text-4xl mt-4 text-gray-200">
                и быстро
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
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
      <ReviewsSection />
      <HowItWorksSection />
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="glass-card rounded-2xl p-8 mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Гарантия лучшей цены</h3>
                <p className="text-gray-200">
                  Предложим цену выше рыночной или найдем того, кто предложит больше
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="glass-card rounded-2xl p-8 mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                  🚗
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Авто из Кореи</h3>
                <p className="text-gray-200">
                  Прямые поставки качественных автомобилей с аукционов Кореи
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="glass-card rounded-2xl p-8 mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Срочный выкуп</h3>
                <p className="text-gray-200">
                  Деньги в день обращения. Работаем 24/7, выезжаем в любую точку города
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-dark py-12 px-4 border-t border-white/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="text-4xl font-bold mb-4 text-white-glow">
              {COMPANY_NAME}
            </div>
            <p className="text-gray-200 mb-6">
              Профессиональный выкуп автомобилей и продажа авто из Кореи
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-200">
              <a 
                href={`tel:${COMPANY_PHONE}`} 
                className="hover:text-orange-400 transition-colors cursor-pointer text-lg"
              >
                {COMPANY_PHONE_DISPLAY}
              </a>
              <span className="hidden md:inline">•</span>
              <span className="text-lg">{COMPANY_EMAIL}</span>
              <span className="hidden md:inline">•</span>
              <span className="text-lg">{COMPANY_ADDRESS}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <KoreaCarWizard 
        isOpen={isKoreaWizardOpen}
        onClose={() => setIsKoreaWizardOpen(false)}
      />
    </div>
  );
};

export default Index;
