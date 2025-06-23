import Navigation from "@/components/Navigation";
import KoreaCarWizard from "@/components/KoreaCarWizard";
import { useState } from "react";
import { BadgePercent, Settings, SearchCheck, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const advantages = [
  {
    number: '01',
    text: 'Авто проходят юридическую проверку перед продажей',
  },
  {
    number: '02',
    text: 'Полная оплата проходит только после осмотра авто',
  },
  {
    number: '03',
    text: 'Возможность доставки автомобиля в другой город',
  },
  {
    number: '04',
    text: 'Авто корректно растаможены, возможность купить авто с полным НДС',
  },
];

const KoreaCarsPage = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-10 relative">
      <div 
        className="absolute inset-0 bg-no-repeat opacity-70 z-0 md:bg-[length:1200px_auto] bg-[length:100vw_auto] bg-center md:bg-[center_20%] bg-[center_top]"
        style={{ 
          backgroundImage: 'url("/korea_background.png")'
        }}
      />
      <div className="relative z-10">
        <Navigation 
          onKoreaClick={() => window.location.href = '/korea-cars'}
          onListingsClick={() => window.location.href = '/?openListings=1'}
        />
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-8 text-center">Авто из Кореи</h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center tracking-wide uppercase text-white/80">Преимущества работы с нами</h2>
          <div className="glass-card bg-white/10 rounded-2xl p-2 sm:p-6 mb-10 divide-y divide-white/10 backdrop-blur-lg border border-white/10 shadow-xl">
            {advantages.map((adv, idx) => (
              <div key={adv.number} className="flex items-center py-6 gap-6 sm:gap-10">
                <div className="text-3xl sm:text-4xl font-extrabold text-white/30 min-w-[48px] text-center select-none">{adv.number}</div>
                <div className="text-base sm:text-lg text-white font-medium opacity-90">{adv.text}</div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto bg-white/5 rounded-2xl shadow-lg p-6 sm:p-8 mb-10 text-white/90 text-base sm:text-lg font-normal leading-relaxed border border-white/10 backdrop-blur-md">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white/80">Как мы работаем</h3>
            <p>
              Мы заключаем с вами договор на подбор авто, учитываем все ваши пожелания и предлагаем несколько вариантов. После утверждения — оформляем договор на поставку, вы оплачиваете только после осмотра. Наш представитель тщательно проверяет авто, делает фото- и видеоотчёт. Благодаря выстроенной логистике мы минимизируем расходы и обеспечиваем быструю, надёжную доставку автомобиля до конечного пункта.
            </p>
          </div>
          <div className="flex justify-center mb-8">
            <button
              className="bg-gradient-to-r from-black via-neutral-800 to-black hover:from-neutral-900 hover:to-neutral-700 text-white font-extrabold py-5 px-12 rounded-2xl text-xl shadow-2xl border border-white/20 transition-all duration-200 tracking-wide uppercase ring-2 ring-white/10 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/20"
              onClick={() => setIsWizardOpen(true)}
            >
              Оставить заявку на подбор авто
            </button>
          </div>
          <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
            <DialogContent className="glass-modal max-w-2xl w-[calc(100%-2rem)] mx-auto my-4 max-h-[calc(100vh-2rem)] overflow-y-auto p-0 sm:p-6 rounded-3xl">
              <KoreaCarWizard />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default KoreaCarsPage; 