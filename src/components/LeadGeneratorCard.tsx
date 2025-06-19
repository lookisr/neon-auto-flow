import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Calendar, DollarSign, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { apiService } from "../lib/api";
import { useToast } from "@/hooks/use-toast";
import { COMPANY_PHONE_DISPLAY } from "../config/constants";

const LeadGeneratorCard = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    desiredPrice: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand || !formData.model || !formData.year || !formData.desiredPrice || !formData.phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
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
      const year = parseInt(formData.year);
      const desiredPrice = parseInt(formData.desiredPrice);
      
      if (isNaN(year) || isNaN(desiredPrice)) {
        throw new Error("Неверный формат данных");
      }

      await apiService.submitCarBuyout({
        brand: formData.brand,
        model: formData.model,
        year,
        desiredPrice,
        phone: formData.phone,
      });

      toast({
        title: "Успешно",
        description: "Ваша заявка отправлена! Мы свяжемся с вами в течение 5 минут.",
      });

      // Очистка формы
      setFormData({
        brand: "",
        model: "",
        year: "",
        desiredPrice: "",
        phone: "",
      });
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

  return (
    <div className="glass-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 animate-float">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 text-white-glow">
          Продайте авто за 
          <span className="text-orange-400 text-magma-glow"> 30 минут</span>
        </h2>
        <p className="text-white text-lg text-white-glow drop-shadow-md">
          Получите выгодное предложение прямо сейчас
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-white font-medium flex items-center gap-2">
              <Car size={16} className="text-orange-400" />
              Марка
            </Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData({...formData, brand: value})}>
              <SelectTrigger className="glass-input text-white hover:border-orange-400/50 transition-colors h-10">
                <SelectValue placeholder="Выберите марку" />
              </SelectTrigger>
              <SelectContent className="glass-modal border-white/30">
                <SelectItem value="toyota">Toyota</SelectItem>
                <SelectItem value="honda">Honda</SelectItem>
                <SelectItem value="hyundai">Hyundai</SelectItem>
                <SelectItem value="kia">Kia</SelectItem>
                <SelectItem value="nissan">Nissan</SelectItem>
                <SelectItem value="mazda">Mazda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-white font-medium flex items-center gap-2">
              <Car size={16} className="text-orange-400" />
              Модель
            </Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              placeholder="Например, Camry"
              className="glass-input text-white hover:border-orange-400/50 focus:border-orange-400/50 focus:ring-orange-400/20 transition-colors h-10"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-white font-medium flex items-center gap-2">
              <Calendar size={16} className="text-orange-400" />
              Год выпуска
            </Label>
            <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
              <SelectTrigger className="glass-input text-white hover:border-orange-400/50 transition-colors">
                <SelectValue placeholder="Выберите год" />
              </SelectTrigger>
              <SelectContent className="glass-modal border-white/30">
                {Array.from({ length: 25 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desiredPrice" className="text-white font-medium flex items-center gap-2">
              <DollarSign size={16} className="text-green-400" />
              Желаемая сумма
            </Label>
            <Input
              id="desiredPrice"
              value={formData.desiredPrice}
              onChange={(e) => setFormData({...formData, desiredPrice: e.target.value})}
              placeholder="Например, 1500000"
              className="glass-input text-white hover:border-green-400/50 focus:border-green-400/50 focus:ring-green-400/20 transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="phone" className="text-white font-medium">
              Ваш телефон
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder={COMPANY_PHONE_DISPLAY}
              className="glass-input text-white hover:border-orange-400/50 focus:border-orange-400/50 focus:ring-orange-400/20 transition-colors"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Отправка заявки...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Получить предложение за 5 минут
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-white text-white-glow drop-shadow-md">
          🔒 Ваши данные защищены • 
          <span className="text-green-400 font-bold"> Бесплатная оценка</span> • 
          Без обязательств
        </p>
      </div>
    </div>
  );
};

export default LeadGeneratorCard;
