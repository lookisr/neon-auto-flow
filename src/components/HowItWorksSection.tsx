import { Phone, Car, DollarSign, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-white-glow">
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
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{index + 1}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4 text-white-glow">
              Готовы продать авто?
            </h3>
            <p className="text-gray-200 mb-6">
              Оставьте заявку прямо сейчас и получите предложение в течение 5 минут
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
