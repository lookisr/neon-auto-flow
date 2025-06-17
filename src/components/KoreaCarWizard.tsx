import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Car, CheckCircle, DollarSign, MapPin, Phone } from "lucide-react";
import { useState } from "react";

interface KoreaCarWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const KoreaCarWizard = ({ isOpen, onClose }: KoreaCarWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    carType: "",
    budget: "",
    delivery: "",
    name: "",
    phone: "",
    email: ""
  });

  const steps = [
    {
      title: "Какой автомобиль вас интересует?",
      icon: Car,
      content: (
        <div className="space-y-4">
          <Label className="text-gray-900 text-lg">Выберите тип автомобиля</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Седан", "SUV/Кроссовер", "Хэтчбек", "Минивен", "Спорткар", "Другое"].map((type) => (
              <button
                key={type}
                onClick={() => setFormData({...formData, carType: type})}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  formData.carType === type
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-300 bg-gray-50 text-gray-900 hover:border-orange-300"
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
          <Label className="text-gray-900 text-lg">Укажите предполагаемый бюджет</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["До 1 млн ₽", "1-2 млн ₽", "2-3 млн ₽", "3-5 млн ₽", "5+ млн ₽", "Другое"].map((budget) => (
              <button
                key={budget}
                onClick={() => setFormData({...formData, budget})}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  formData.budget === budget
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-300 bg-gray-50 text-gray-900 hover:border-green-300"
                }`}
              >
                {budget}
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
          <Label className="text-gray-900 text-lg">Как планируете получить автомобиль?</Label>
          <div className="space-y-3">
            {[
              "Доставка до двери (включена в стоимость)",
              "Самовывоз из порта Владивосток",
              "Самовывоз из Москвы"
            ].map((delivery) => (
              <button
                key={delivery}
                onClick={() => setFormData({...formData, delivery})}
                className={`w-full p-4 rounded-lg border text-left transition-all duration-300 ${
                  formData.delivery === delivery
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 bg-gray-50 text-gray-900 hover:border-blue-300"
                }`}
              >
                {delivery}
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
            <Label htmlFor="name" className="text-gray-900">Имя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ваше имя"
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900">Телефон</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+7 (999) 123-45-67"
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900">Email (необязательно)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              className="bg-gray-50 border-gray-300 text-gray-900"
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
          <div className="p-4 bg-green-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Заявка принята!</h3>
            <p className="text-gray-600 mb-6">
              Наш специалист свяжется с вами в течение 15 минут для уточнения деталей 
              и подбора идеального автомобиля из Кореи.
            </p>
          </div>
          <Button 
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
          >
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

  const handleSubmit = () => {
    console.log("Korea car form submitted:", formData);
    setCurrentStep(steps.length - 1);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-300 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Шаг {currentStep + 1} из {steps.length}
              </span>
              <span className="text-sm text-orange-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-50 rounded-full border border-orange-200">
                <Icon className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
            </div>
            
            {currentStepData.content}
          </div>

          {/* Navigation buttons */}
          {currentStep < steps.length - 1 && (
            <div className="flex justify-between">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                variant="outline"
                className="border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              
              {currentStep === steps.length - 2 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Отправить заявку
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 0 && !formData.carType) ||
                    (currentStep === 1 && !formData.budget) ||
                    (currentStep === 2 && !formData.delivery) ||
                    (currentStep === 3 && (!formData.name || !formData.phone))
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-white"
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
