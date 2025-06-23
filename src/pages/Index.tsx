import { useState, useRef } from "react";
import { FileText, Car as CarIcon, Zap, Ship, MessageSquare } from "lucide-react";
import Navigation from "@/components/Navigation";
import LeadGeneratorCard from "@/components/LeadGeneratorCard";
import VideoSection from "@/components/VideoSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import KoreaCarWizard from "@/components/KoreaCarWizard";
import ListingsPage from "@/components/ListingsPage";
import ReviewsSection from "@/components/ReviewsSection";
import { COMPANY_PHONE, COMPANY_PHONE_DISPLAY, COMPANY_EMAIL, COMPANY_ADDRESS, COMPANY_NAME } from "@/config/constants";
import { BRANDS } from "@/constants/brands";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api";
import CarHeadlightGlowOverlay from "@/components/CarHeadlightGlowOverlay";

const CARD_STYLE =
  "glass-card border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col h-full justify-between items-center text-center transition-all duration-300 hover:shadow-2xl hover:border-white/30 flex-1 min-h-[420px]";
const BUTTON_STYLE =
  "mt-6 px-6 py-3 rounded-xl bg-white text-black font-bold text-lg transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50";

const Index = () => {
  const [isKoreaWizardOpen, setIsKoreaWizardOpen] = useState(false);
  const [isListingsOpen, setIsListingsOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    phone: "",
    name: "",
    email: "",
    message: "",
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [carGlowHover, setCarGlowHover] = useState(false);
  const leadSectionRef = useRef<HTMLDivElement | null>(null);

  // Если открыта страница объявлений, показываем только её
  if (isListingsOpen) {
    return (
      <ListingsPage 
        isOpen={isListingsOpen}
        onClose={() => setIsListingsOpen(false)}
      />
    );
  }

  const handleLeadInputChange = (field: string, value: string) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.brand || !leadForm.model || !leadForm.year || !leadForm.price || !leadForm.phone || !leadForm.name || !leadForm.email) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    setLeadSubmitting(true);
    try {
      const year = parseInt(leadForm.year);
      const price = parseInt(leadForm.price);
      if (isNaN(year) || isNaN(price)) {
        throw new Error("Неверный формат года или цены");
      }
      await apiService.submitCarBuyout({
        brand: leadForm.brand,
        model: leadForm.model,
        year,
        desiredPrice: price,
        phone: leadForm.phone,
        // Можно добавить name, email, message в отдельный endpoint или в message
      });
      toast({
        title: "Успешно",
        description: "Ваша заявка отправлена! Мы свяжемся с вами в течение 5 минут.",
      });
      setLeadForm({ brand: "", model: "", year: "", price: "", phone: "", name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить заявку",
        variant: "destructive",
      });
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleScrollToLead = () => {
    if (leadSectionRef.current) {
      leadSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navigation onKoreaClick={() => setIsKoreaWizardOpen(true)} onListingsClick={() => setIsListingsOpen(true)} />
      {/* Central Car Image — seamless with black background */}
      <div className="flex justify-center items-center pt-40 pb-12 px-4 bg-black">
        <div
          className="relative w-full max-w-3xl h-[220px] md:h-[300px] lg:h-[360px]"
          onMouseEnter={() => setCarGlowHover(true)}
          onMouseLeave={() => setCarGlowHover(false)}
        >
          <img
            src="/car.jpg"
            alt="Автомобиль"
            className="w-full h-full object-cover rounded-3xl"
            style={{ aspectRatio: "16/7", boxShadow: "0 0 120px 40px #000" }}
          />
          <CarHeadlightGlowOverlay width={1200} height={360} intensity={carGlowHover ? 1 : 0.7} />
          <div className="absolute inset-0 pointer-events-none z-30" style={{
            background: `
              linear-gradient(to right, #000 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, #000 100%),
              linear-gradient(to bottom, #000 0%, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 92%, #000 100%),
              radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, #000 100%)
            `
          }} />
        </div>
      </div>
      {/* Hero Section */}
      <header className="pb-8 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
          {COMPANY_NAME}
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-gray-400 mb-8">
          Современный сервис для продажи и покупки автомобилей
        </h2>
      </header>
      {/* Cards */}
      <div className="container mx-auto max-w-4xl flex flex-col md:flex-row gap-8 mb-12 px-4 items-stretch">
        {/* Sell Car Card */}
        <div className={`${CARD_STYLE} bg-[#ff3333]/20`}>
          <div className="flex-grow flex flex-col items-center w-full">
            <div className="mb-4 bg-[#ff3333]/10 p-4 rounded-full border border-[#ff3333]/20">
              <FileText className="h-10 w-10 text-[#ff3333]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Продать своё авто</h3>
            <p className="text-gray-300 mb-4">
              Быстрое и безопасное оформление. Получите предложение за 5 минут и деньги сразу.
            </p>
          </div>
          <button className={BUTTON_STYLE + " w-full h-14 mt-auto"} onClick={handleScrollToLead}>Продать авто</button>
        </div>
        {/* Import Car Card */}
        <div className={`${CARD_STYLE} bg-[#ff9933]/20`}>
          <div className="flex-grow flex flex-col items-center w-full">
            <div className="mb-4 bg-[#ff9933]/10 p-4 rounded-full border border-[#ff9933]/20">
              <CarIcon className="h-10 w-10 text-[#ff9933]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Привезти авто из Кореи</h3>
            <p className="text-gray-300 mb-4">
              Прямые поставки, прозрачные условия, полное сопровождение сделки.
            </p>
          </div>
          <button className={BUTTON_STYLE + " w-full h-14 mt-auto"} onClick={() => setIsKoreaWizardOpen(true)}>Заказать авто</button>
        </div>
        {/* New Listing Card */}
        <div className={`${CARD_STYLE} bg-[#33cc33]/20`}>
          <div className="flex-grow flex flex-col items-center w-full">
            <div className="mb-4 bg-[#33cc33]/10 p-4 rounded-full border border-[#33cc33]/20">
              <MessageSquare className="h-10 w-10 text-[#33cc33]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Разместить объявление</h3>
            <p className="text-gray-300 mb-4 text-center">
              Хотите продать авто самостоятельно? Разместите объявление на нашей доске — это бесплатно!
            </p>
            <div className="flex-grow" />
          </div>
          <button className={BUTTON_STYLE + " w-full min-h-[56px] mt-auto text-center whitespace-nowrap break-words leading-tight sm:text-lg text-base"} onClick={() => setIsListingsOpen(true)}>Разместить авто</button>
        </div>
      </div>
      {/* Contact Form / Лидогенерация */}
      <section ref={leadSectionRef} className="container mx-auto max-w-2xl mb-20 px-4">
        <div className="glass-card border border-white/10 rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Продажа авто</h3>
          <form className="space-y-6" onSubmit={handleLeadSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={leadForm.brand} onValueChange={v => handleLeadInputChange('brand', v)}>
                  <SelectTrigger className="glass-input text-white !bg-[#232323] force-dark-bg h-11">
                    <SelectValue placeholder="Марка" />
                  </SelectTrigger>
                  <SelectContent className="glass-modal border-white/30" side="bottom" avoidCollisions={false}>
                    {BRANDS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  className="glass-input text-white placeholder-white h-12 px-4 py-3 !bg-[#232323] text-base md:h-11 md:px-3 md:py-2 md:text-sm"
                  placeholder="Модель"
                  value={leadForm.model}
                  onChange={e => handleLeadInputChange('model', e.target.value)}
                  disabled={leadSubmitting}
                />
              </div>
              <div>
                <Input
                  className="glass-input text-white placeholder-white h-12 px-4 py-3 !bg-[#232323] text-base md:h-11 md:px-3 md:py-2 md:text-sm"
                  placeholder="Год"
                  type="number"
                  value={leadForm.year}
                  onChange={e => handleLeadInputChange('year', e.target.value)}
                  disabled={leadSubmitting}
                />
              </div>
              <div>
                <Input
                  className="glass-input text-white placeholder-white h-12 px-4 py-3 !bg-[#232323] text-base md:h-11 md:px-3 md:py-2 md:text-sm"
                  placeholder="Цена, ₽"
                  type="number"
                  value={leadForm.price}
                  onChange={e => handleLeadInputChange('price', e.target.value)}
                  disabled={leadSubmitting}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  className="glass-input text-white placeholder-white h-12 px-4 py-3 !bg-[#232323] text-base md:h-11 md:px-3 md:py-2 md:text-sm"
                  placeholder="Телефон"
                  value={leadForm.phone}
                  onChange={e => handleLeadInputChange('phone', e.target.value)}
                  disabled={leadSubmitting}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  className="glass-input text-white placeholder-white h-12 px-4 py-3 !bg-[#232323] text-base md:h-11 md:px-3 md:py-2 md:text-sm"
                  placeholder="Ваше имя"
                  value={leadForm.name}
                  onChange={e => handleLeadInputChange('name', e.target.value)}
                  disabled={leadSubmitting}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  className="glass-input text-white placeholder-white h-12 px-4 py-3 !bg-[#232323] text-base md:h-11 md:px-3 md:py-2 md:text-sm"
                  placeholder="E-mail"
                  value={leadForm.email}
                  onChange={e => handleLeadInputChange('email', e.target.value)}
                  disabled={leadSubmitting}
                />
              </div>
              <div className="md:col-span-2">
                <textarea
                  placeholder="Сообщение"
                  rows={4}
                  className="w-full glass-input text-white placeholder-white rounded-lg px-4 py-3 h-28 !bg-[#232323] text-base md:text-sm md:px-3 md:py-2 focus:outline-none focus:border-white/50 transition-all resize-none"
                  value={leadForm.message}
                  onChange={e => handleLeadInputChange('message', e.target.value)}
                  disabled={leadSubmitting}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-xl text-lg transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={leadSubmitting}
            >
              {leadSubmitting ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        </div>
      </section>
      <VideoSection />
      <ReviewsSection />
      <HowItWorksSection onScrollToLead={handleScrollToLead} />
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="glass-card rounded-2xl p-8 mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                  ₽
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Гарантия лучшей цены</h3>
                <p className="text-gray-300">
                  Мы предлагаем лучшие цены на рынке. Если найдете дешевле — сделаем скидку!
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="glass-card rounded-2xl p-8 mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Авто из Кореи</h3>
                <p className="text-gray-300">
                  Прямые поставки автомобилей из Кореи. Прозрачные условия, полное сопровождение.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="glass-card rounded-2xl p-8 mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">
                  ⏱
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Срочный выкуп</h3>
                <p className="text-gray-300">
                  Быстрый выкуп вашего авто по честной цене. Деньги — сразу!
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
            <div className="text-4xl font-bold mb-4">
              {COMPANY_NAME}
            </div>
            <p className="text-gray-300 mb-6">
              © {new Date().getFullYear()} {COMPANY_NAME}. Все права защищены.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-300">
              <a 
                href={`tel:${COMPANY_PHONE}`} 
                className="hover:text-white transition-colors cursor-pointer text-lg"
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
