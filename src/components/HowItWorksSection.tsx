
import { CheckCircle, Clock, DollarSign, FileText } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: FileText,
      number: "01",
      title: "Оставьте заявку",
      description: "Заполните форму с данными о вашем автомобиле",
      color: "blue"
    },
    {
      icon: CheckCircle,
      number: "02", 
      title: "Получите оценку",
      description: "Наш эксперт проведет предварительную оценку",
      color: "orange"
    },
    {
      icon: Clock,
      number: "03",
      title: "Выезд специалиста",
      description: "Осмотр автомобиля и финальная оценка на месте",
      color: "green"
    },
    {
      icon: DollarSign,
      number: "04",
      title: "Получите деньги",
      description: "Мгновенная выплата наличными или на карту",
      color: "red"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Как мы <span className="text-orange-500">работаем</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Простой и прозрачный процесс выкупа автомобилей
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group relative bg-white backdrop-blur-lg border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all duration-500 animate-fade-in-up hover:transform hover:scale-105 shadow-lg"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className={`inline-flex p-4 rounded-full bg-${step.color}-50 border border-${step.color}-200 group-hover:border-${step.color}-300 transition-all duration-300`}>
                      <Icon className={`h-8 w-8 text-${step.color}-500`} />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-${step.color}-500 text-white font-bold text-sm flex items-center justify-center`}>
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-gray-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-green-50 border border-green-200 rounded-2xl p-6">
            <p className="text-green-600 font-semibold text-lg">
              ⚡ Среднее время сделки: <span className="text-gray-900">30 минут</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
