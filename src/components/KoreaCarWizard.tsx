import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Car, CheckCircle, DollarSign, MapPin, Phone, Loader2 } from "lucide-react";
import { useState } from "react";
import { apiService } from "../lib/api";
import { useToast } from "@/hooks/use-toast";
import { COMPANY_PHONE, COMPANY_PHONE_DISPLAY } from "../config/constants";

interface KoreaCarWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const KoreaCarWizard = ({ isOpen, onClose }: KoreaCarWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    carType: "",
    budget: "",
    deliveryCity: "",
    name: "",
    phone: ""
  });
  const { toast } = useToast();

  const handleCall = () => {
    // Создаем ссылку для звонка
    window.location.href = `tel:${COMPANY_PHONE}`;
  };

  const handleResetForm = () => {
    // Сбрасываем форму к начальному состоянию
    setFormData({
      carType: "",
      budget: "",
      deliveryCity: "",
      name: "",
      phone: ""
    });
    // Возвращаемся к первому шагу
    setCurrentStep(0);
  };

  const handleClose = () => {
    // Сбрасываем форму при закрытии
    handleResetForm();
    // Закрываем модальное окно
    onClose();
  };

  const steps = [
    {
      title: "Какой автомобиль вас интересует?",
      icon: Car,
      content: (
        <div className="space-y-4">
          <Label className="text-white text-base sm:text-lg font-medium">Выберите тип автомобиля</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {["Седан", "SUV/Кроссовер", "Хэтчбек", "Минивен", "Спорткар", "Другое"].map((type) => (
              <button
                key={type}
                onClick={() => setFormData({...formData, carType: type})}
                className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 glass-input text-white border-white/30 hover:border-white/50 hover:bg-white/5 !bg-[#232323] text-sm sm:text-base ${
                  formData.carType === type
                    ? "scale-[1.02] sm:scale-105"
                    : ""
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Ваш бюджет на покупку?",
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <Label className="text-white text-base sm:text-lg font-medium">Укажите предполагаемый бюджет</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { label: "До 1 млн ₽", value: 1000000 },
              { label: "1-2 млн ₽", value: 2000000 },
              { label: "2-3 млн ₽", value: 3000000 },
              { label: "3-5 млн ₽", value: 5000000 },
              { label: "5+ млн ₽", value: 10000000 },
              { label: "Другое", value: 0 }
            ].map((budget) => (
              <button
                key={budget.label}
                onClick={() => setFormData({...formData, budget: budget.value.toString()})}
                className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 glass-input text-white border-white/30 hover:border-white/50 hover:bg-white/5 !bg-[#232323] text-sm sm:text-base ${
                  formData.budget === budget.value.toString()
                    ? "scale-[1.02] sm:scale-105"
                    : ""
                }`}
              >
                {budget.label}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Способ доставки",
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <Label className="text-white text-base sm:text-lg font-medium">Как планируете получить автомобиль?</Label>
          <div className="space-y-3">
            {[
              { label: "Доставка до двери (включена в стоимость)", city: "delivery_door" },
              { label: "Самовывоз из порта Владивосток", city: "vladivostok" },
              { label: "Самовывоз из Москвы", city: "moscow_pickup" }
            ].map((delivery) => (
              <button
                key={delivery.label}
                onClick={() => setFormData({...formData, deliveryCity: delivery.city})}
                className={`w-full p-3 sm:p-4 rounded-xl border text-left transition-all duration-300 glass-input text-white border-white/30 hover:border-white/50 hover:bg-white/5 !bg-[#232323] text-sm sm:text-base ${
                  formData.deliveryCity === delivery.city
                    ? "scale-[1.02] sm:scale-105"
                    : ""
                }`}
              >
                {delivery.label}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Ваши контактные данные",
      icon: Phone,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium">Имя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ваше имя"
              className="glass-input !text-white placeholder-gray-300 !bg-[#232323] focus:!text-white [&:not(:placeholder-shown)]:!text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white font-medium">Телефон</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder={COMPANY_PHONE_DISPLAY}
              className="glass-input !text-white placeholder-gray-300 !bg-[#232323] focus:!text-white [&:not(:placeholder-shown)]:!text-white"
            />
          </div>
        </div>
      )
    },
    {
      title: "Спасибо за заявку!",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <div className="glass-card rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Заявка принята!</h3>
            <p className="text-gray-200 mb-6">
              Наш специалист свяжется с вами в течение 15 минут для уточнения деталей 
              и подбора идеального автомобиля из Кореи.
            </p>
          </div>
          <Button 
            onClick={handleCall}
            className="bg-white text-black px-8 py-3"
          >
            <Phone className="mr-2 h-4 w-4" />
            Получить консультацию
          </Button>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.carType || !formData.budget || !formData.deliveryCity || !formData.name || !formData.phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Запускаем таймер на 2 секунды для анимации
    const animationTimer = setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);

    try {
      const budget = parseInt(formData.budget);
      if (isNaN(budget) || budget <= 0) {
        throw new Error("Неверный формат бюджета");
      }

      await apiService.submitCarImport({
        carType: formData.carType,
        budget,
        deliveryCity: formData.deliveryCity,
        name: formData.name,
        phone: formData.phone,
      });

      toast({
        title: "Успешно",
        description: "Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.",
      });

      setCurrentStep(steps.length - 1);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить заявку",
        variant: "destructive",
      });
    } finally {
      // Очищаем таймер если запрос завершился раньше 2 секунд
      clearTimeout(animationTimer);
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-modal max-w-2xl w-[calc(100%-2rem)] mx-auto my-4 max-h-[calc(100vh-2rem)] overflow-y-auto p-0 sm:p-6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="p-4 sm:p-6">
          {/* Progress bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-300">
                Шаг {currentStep + 1} из {steps.length}
              </span>
              <span className="text-sm text-white font-medium">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full glass-input rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="glass-card p-2 sm:p-3 rounded-full border border-white/20">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{currentStepData.title}</h2>
            </div>
            
            {currentStepData.content}
          </div>

          {/* Navigation buttons */}
          {currentStep < steps.length - 1 && (
            <div className="flex justify-between gap-4">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                variant="outline"
                className="glass-input text-white border-white/30 hover:bg-white/10 text-sm sm:text-base px-3 sm:px-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              
              {currentStep === steps.length - 2 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-white text-black text-sm sm:text-base px-3 sm:px-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      Отправить заявку
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 0 && !formData.carType) ||
                    (currentStep === 1 && !formData.budget) ||
                    (currentStep === 2 && !formData.deliveryCity) ||
                    (currentStep === 3 && (!formData.name || !formData.phone))
                  }
                  className="bg-white text-black text-sm sm:text-base px-3 sm:px-4"
                >
                  Далее
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KoreaCarWizard;
