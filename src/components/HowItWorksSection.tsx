import { Phone, Car, DollarSign, CheckCircle, ArrowDown } from "lucide-react";
import { useRef } from "react";

const HowItWorksSection = ({ onScrollToLead }: { onScrollToLead?: () => void }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const steps = [
    {
      icon: Phone,
      title: "Звонок",
      description: "Позвоните нам или оставьте заявку на сайте",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Car,
      title: "Оценка",
      description: "Наш специалист приедет и оценит ваш автомобиль",
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: DollarSign,
      title: "Предложение",
      description: "Получите выгодное предложение на месте",
      color: "from-green-400 to-green-600"
    },
    {
      icon: CheckCircle,
      title: "Сделка",
      description: "Подписываем документы и передаем деньги",
      color: "from-red-400 to-red-600"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-white">
            Как это работает
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Всего 4 простых шага до получения денег за ваш автомобиль
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center group">
                <div className="glass-card rounded-2xl p-6 mb-6 group-hover:scale-105 transition-all duration-300">
                  <div className={`w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{index + 1}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4 text-white">
              Готовы продать авто?
            </h3>
            <p className="text-gray-200 mb-6">
              Оставьте заявку прямо сейчас и получите предложение в течение 5 минут
            </p>
            <button
              ref={buttonRef}
              onClick={onScrollToLead}
              className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg shadow transition-all duration-200 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-center mx-auto"
            >
              Оставить заявку
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </button>
            <div className="w-32 h-1 bg-white mx-auto rounded-full animate-pulse-slow mt-6"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
