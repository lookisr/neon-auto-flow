
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Calendar, DollarSign, Zap } from "lucide-react";
import { useState } from "react";

const LeadGeneratorCard = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Здесь будет логика отправки формы
  };

  return (
    <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-50 rounded-full border border-red-200">
            <Zap className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Продайте авто за 
          <span className="text-red-500"> 30 минут</span>
        </h2>
        <p className="text-gray-600">Получите выгодное предложение прямо сейчас</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-gray-900 font-medium flex items-center gap-2">
              <Car size={16} className="text-orange-500" />
              Марка автомобиля
            </Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData({...formData, brand: value})}>
              <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 hover:border-orange-300 transition-colors">
                <SelectValue placeholder="Выберите марку" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
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
            <Label htmlFor="model" className="text-gray-900 font-medium">
              Модель
            </Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              placeholder="Например, Camry"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-orange-300 focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-gray-900 font-medium flex items-center gap-2">
              <Calendar size={16} className="text-orange-500" />
              Год выпуска
            </Label>
            <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
              <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 hover:border-orange-300 transition-colors">
                <SelectValue placeholder="Выберите год" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
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
            <Label htmlFor="price" className="text-gray-900 font-medium flex items-center gap-2">
              <DollarSign size={16} className="text-green-600" />
              Желаемая сумма
            </Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="Например, 1 500 000"
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 hover:border-green-300 focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 text-lg transition-all duration-300 transform hover:scale-105"
        >
          <Zap className="mr-2 h-5 w-5" />
          Получить предложение за 5 минут
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          🔒 Ваши данные защищены • 
          <span className="text-green-600"> Бесплатная оценка</span> • 
          Без обязательств
        </p>
      </div>
    </div>
  );
};

export default LeadGeneratorCard;
