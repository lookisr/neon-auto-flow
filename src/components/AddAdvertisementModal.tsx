import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiService } from "../lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, X, Upload, Car, Calendar, DollarSign, Gauge, Users, Wrench, Fuel, Palette, AlertCircle, Plus, Camera } from "lucide-react";

interface AddAdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdvertisementCreated?: () => void;
}

const AddAdvertisementModal = ({ isOpen, onClose, onAdvertisementCreated }: AddAdvertisementModalProps) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    description: "",
    contacts: "",
    engineVolume: "",
    mileage: "",
    ownersCount: "",
    isDamaged: "false",
    transmission: "manual",
    fuelType: "gasoline",
    color: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    brand?: string;
    model?: string;
    year?: string;
    price?: string;
    description?: string;
    contacts?: string;
    engineVolume?: string;
    mileage?: string;
    ownersCount?: string;
    color?: string;
    general?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const clearErrors = () => {
    setFieldErrors({});
  };

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'brand':
        if (!value.trim()) return "Марка автомобиля обязательна";
        if (value.length < 2) return "Марка должна содержать минимум 2 символа";
        break;
      case 'model':
        if (!value.trim()) return "Модель автомобиля обязательна";
        if (value.length < 2) return "Модель должна содержать минимум 2 символа";
        break;
      case 'year':
        if (!value) return "Год выпуска обязателен";
        const year = parseInt(value);
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
          return "Введите корректный год выпуска";
        }
        break;
      case 'price':
        if (!value) return "Цена обязательна";
        const price = parseInt(value);
        if (isNaN(price) || price <= 0) return "Введите корректную цену";
        break;
      case 'description':
        if (!value.trim()) return "Описание обязательно";
        if (value.length < 10) return "Описание должно содержать минимум 10 символов";
        break;
      case 'contacts':
        if (!value.trim()) return "Контактная информация обязательна";
        break;
      case 'engineVolume':
        if (!value) return "Объем двигателя обязателен";
        const volume = parseFloat(value);
        if (isNaN(volume) || volume < 0.5 || volume > 10) {
          return "Объем двигателя должен быть от 0.5 до 10 литров";
        }
        break;
      case 'mileage':
        if (!value) return "Пробег обязателен";
        const mileage = parseInt(value);
        if (isNaN(mileage) || mileage < 0) return "Пробег должен быть положительным числом";
        break;
      case 'ownersCount':
        if (!value) return "Количество владельцев обязательно";
        const owners = parseInt(value);
        if (isNaN(owners) || owners < 1 || owners > 20) {
          return "Количество владельцев должно быть от 1 до 20";
        }
        break;
      case 'color':
        if (!value.trim()) return "Цвет автомобиля обязателен";
        break;
    }
    return undefined;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    // Очищаем ошибку поля при вводе
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors({...fieldErrors, [field]: undefined});
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Проверяем количество файлов
    if (selectedFiles.length + files.length > 10) {
      toast({
        title: "Ошибка",
        description: "Максимальное количество фотографий: 10",
        variant: "destructive",
      });
      return;
    }

    // Проверяем типы файлов
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Ошибка",
        description: "Поддерживаются только JPEG, PNG и WebP файлы",
        variant: "destructive",
      });
      return;
    }

    // Проверяем размер файлов (5MB максимум)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (!isAuthenticated) {
      setFieldErrors({ general: "Для добавления объявления необходимо войти в систему" });
      return;
    }

    // Валидация всех полей
    const errors: typeof fieldErrors = {};
    const fieldsToValidate = ['brand', 'model', 'year', 'price', 'description', 'contacts', 'engineVolume', 'mileage', 'ownersCount', 'color'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field as keyof typeof fieldErrors] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const year = parseInt(formData.year);
      const price = parseInt(formData.price);
      const engineVolume = parseFloat(formData.engineVolume);
      const mileage = parseInt(formData.mileage);
      const ownersCount = parseInt(formData.ownersCount);
      
      if (isNaN(year) || isNaN(price) || isNaN(engineVolume) || isNaN(mileage) || isNaN(ownersCount)) {
        throw new Error("Неверный формат данных");
      }

      const response = await apiService.createAdvertisement({
        brand: formData.brand,
        model: formData.model,
        year,
        price,
        description: formData.description,
        contacts: formData.contacts,
        photos: selectedFiles,
        engineVolume,
        mileage,
        ownersCount,
        isDamaged: formData.isDamaged === 'true',
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        color: formData.color,
      });

      console.log('🔧 [DEBUG] Advertisement created successfully:', response);

      toast({
        title: "Успешно",
        description: "Объявление добавлено!",
      });

      // Очистка формы
      setFormData({
        brand: "",
        model: "",
        year: "",
        price: "",
        description: "",
        contacts: "",
        engineVolume: "",
        mileage: "",
        ownersCount: "",
        isDamaged: "false",
        transmission: "manual",
        fuelType: "gasoline",
        color: "",
      });
      setSelectedFiles([]);
      clearErrors();
      
      onClose();
      if (onAdvertisementCreated) {
        onAdvertisementCreated();
      }
    } catch (error: any) {
      console.error('🔧 [DEBUG] Create advertisement error:', error);
      let errorMessage = "Не удалось добавить объявление";
      if (error?.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      setFieldErrors({ general: errorMessage });
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white text-center text-white-glow">
            Добавить объявление
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Основная информация */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Car className="h-5 w-5 text-orange-400" />
              Основная информация
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-white font-medium">
                  Марка автомобиля *
                </Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="Например: Toyota"
                  disabled={isSubmitting}
                />
                {fieldErrors.brand && (
                  <p className="text-red-400 text-sm">{fieldErrors.brand}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="text-white font-medium">
                  Модель *
                </Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="Например: Camry"
                  disabled={isSubmitting}
                />
                {fieldErrors.model && (
                  <p className="text-red-400 text-sm">{fieldErrors.model}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-white font-medium">
                  Год выпуска *
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="Например: 2020"
                  disabled={isSubmitting}
                />
                {fieldErrors.year && (
                  <p className="text-red-400 text-sm">{fieldErrors.year}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-white font-medium">
                  Цена (₽) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="Например: 1500000"
                  disabled={isSubmitting}
                />
                {fieldErrors.price && (
                  <p className="text-red-400 text-sm">{fieldErrors.price}</p>
                )}
              </div>
            </div>
          </div>

          {/* Технические характеристики */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Технические характеристики
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="engineVolume" className="text-white font-medium">
                  Объем двигателя (л) *
                </Label>
                <Input
                  id="engineVolume"
                  type="number"
                  step="0.1"
                  value={formData.engineVolume}
                  onChange={(e) => handleInputChange('engineVolume', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="Например: 2.5"
                  disabled={isSubmitting}
                />
                {fieldErrors.engineVolume && (
                  <p className="text-red-400 text-sm">{fieldErrors.engineVolume}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-white font-medium">
                  Пробег (км) *
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="Например: 50000"
                  disabled={isSubmitting}
                />
                {fieldErrors.mileage && (
                  <p className="text-red-400 text-sm">{fieldErrors.mileage}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownersCount" className="text-white font-medium">
                  Количество владельцев *
                </Label>
                <Input
                  id="ownersCount"
                  type="number"
                  value={formData.ownersCount}
                  onChange={(e) => handleInputChange('ownersCount', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="Например: 2"
                  disabled={isSubmitting}
                />
                {fieldErrors.ownersCount && (
                  <p className="text-red-400 text-sm">{fieldErrors.ownersCount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission" className="text-white font-medium">
                  Коробка передач
                </Label>
                <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                  <SelectTrigger className="glass-input text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-modal">
                    <SelectItem value="manual">Механика</SelectItem>
                    <SelectItem value="automatic">Автомат</SelectItem>
                    <SelectItem value="robot">Робот</SelectItem>
                    <SelectItem value="variator">Вариатор</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-white font-medium">
                  Тип топлива
                </Label>
                <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
                  <SelectTrigger className="glass-input text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-modal">
                    <SelectItem value="gasoline">Бензин</SelectItem>
                    <SelectItem value="diesel">Дизель</SelectItem>
                    <SelectItem value="hybrid">Гибрид</SelectItem>
                    <SelectItem value="electric">Электро</SelectItem>
                    <SelectItem value="lpg">Газ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-white font-medium">
                  Цвет *
                </Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="Например: Белый"
                  disabled={isSubmitting}
                />
                {fieldErrors.color && (
                  <p className="text-red-400 text-sm">{fieldErrors.color}</p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="isDamaged" className="text-white font-medium">
                Состояние
              </Label>
              <Select value={formData.isDamaged} onValueChange={(value) => handleInputChange('isDamaged', value)}>
                <SelectTrigger className="glass-input text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-modal">
                  <SelectItem value="false">Не битый</SelectItem>
                  <SelectItem value="true">Битый</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Описание */}
          <div className="glass-card rounded-xl p-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-medium">
                Описание *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="glass-input text-white placeholder-gray-300 min-h-[120px]"
                placeholder="Подробно опишите состояние автомобиля, комплектацию, особенности..."
                disabled={isSubmitting}
              />
              {fieldErrors.description && (
                <p className="text-red-400 text-sm">{fieldErrors.description}</p>
              )}
            </div>
          </div>

          {/* Контакты */}
          <div className="glass-card rounded-xl p-6">
            <div className="space-y-2">
              <Label htmlFor="contacts" className="text-white font-medium">
                Контактная информация *
              </Label>
              <Input
                id="contacts"
                value={formData.contacts}
                onChange={(e) => handleInputChange('contacts', e.target.value)}
                className="glass-input text-white placeholder-gray-300"
                placeholder="Телефон, email или другие способы связи"
                disabled={isSubmitting}
              />
              {fieldErrors.contacts && (
                <p className="text-red-400 text-sm">{fieldErrors.contacts}</p>
              )}
            </div>
          </div>

          {/* Фотографии */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-400" />
              Фотографии автомобиля
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || selectedFiles.length >= 10}
                  className="glass-input text-white border-white/30 hover:bg-white/10"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Выбрать фото
                </Button>
                <span className="text-gray-300 text-sm">
                  {selectedFiles.length}/10 фотографий
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Общие ошибки */}
          {fieldErrors.general && (
            <div className="glass-card rounded-xl p-4 bg-red-500/20 border-red-500/30">
              <p className="text-red-400 text-center">{fieldErrors.general}</p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="glass-input text-white border-white/30 hover:bg-white/10"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Создать объявление
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdvertisementModal; 