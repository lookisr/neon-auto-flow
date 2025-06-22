import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Car, MapPin, Phone, User, CheckCircle, Star, Clock, Gauge, Users, Wrench, Fuel, Palette, ChevronLeft, ChevronRight, Edit, Trash2, FileText, Settings } from "lucide-react";
import { Advertisement } from "../lib/api";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AdvertisementDetailModalProps {
  advertisement: Advertisement | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (advertisement: Advertisement) => void;
  onDelete?: (advertisement: Advertisement) => void;
}

const AdvertisementDetailModal = ({ advertisement, isOpen, onClose, onEdit, onDelete }: AdvertisementDetailModalProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { user } = useAuth();

  console.log('🔧 [DEBUG] AdvertisementDetailModal props:', { advertisement, isOpen });

  // Проверяем, является ли пользователь компанией
  const isCompany = user?.email === 'company@kpsauto.ru';

  if (!advertisement) {
    console.log('🔧 [DEBUG] AdvertisementDetailModal: No advertisement provided');
    return null;
  }

  const photos = advertisement.photoUrls.length > 0 ? advertisement.photoUrls : ["/placeholder.svg"];
  console.log('🔧 [DEBUG] AdvertisementDetailModal: Photos array:', photos);
  
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getTransmissionText = (transmission: string) => {
    const map: { [key: string]: string } = {
      manual: 'Механика',
      automatic: 'Автомат',
      robot: 'Робот',
      variator: 'Вариатор'
    };
    return map[transmission] || transmission;
  };

  const getFuelTypeText = (fuelType: string) => {
    const map: { [key: string]: string } = {
      gasoline: 'Бензин',
      diesel: 'Дизель',
      hybrid: 'Гибрид',
      electric: 'Электро',
      lpg: 'Газ'
    };
    return map[fuelType] || fuelType;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-6xl w-full mx-1 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-2 sm:p-6 rounded-lg sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
            <span>{advertisement.brand} {advertisement.carModel}</span>
            {isCompany && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onEdit && advertisement) {
                      onEdit(advertisement);
                    }
                  }}
                  className="glass-input text-white border-white/30 hover:bg-white/10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onDelete && advertisement) {
                      onClose();
                      onDelete(advertisement);
                    }
                  }}
                  className="bg-red-500/20 text-red-400 border-red-400/30 hover:bg-red-500/30 relative"
                >
                  <span className="flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Удалить</span>
                  </span>
                  <span className="absolute right-2 top-1 sm:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Галерея фотографий */}
          <div className="relative">
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
              <img 
                src={photos[currentPhotoIndex]} 
                alt={`${advertisement.brand} ${advertisement.carModel} - фото ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Навигация по фотографиям */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-input text-white border-white/30 hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-input text-white border-white/30 hover:bg-white/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {/* Индикатор текущей фотографии */}
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="absolute top-4 right-4 glass-card px-4 py-2 rounded-full text-xl font-bold text-white">
              {advertisement.price.toLocaleString('ru-RU')} ₽
            </div>
            
            {/* Иконки статуса - позиционируем их рядом */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {/* ВРЕМЕННО: выводим email пользователя для отладки */}
              {/* {advertisement.user && (
                <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs mb-1">
                  {advertisement.user.email}
                </div>
              )} */}
              {advertisement.user && (advertisement.user.role === 'admin' || advertisement.user.role === 'moderator') && (
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg z-50">
                  <CheckCircle className="mr-1" size={16} />
                  Проверено
                </div>
              )}
              {advertisement.isDamaged && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Wrench size={14} />
                  Битый
                </div>
              )}
            </div>
          </div>

          {/* Миниатюры фотографий */}
          {photos.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                    index === currentPhotoIndex ? 'border-orange-500' : 'border-white/30'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Миниатюра ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Основная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Car className="h-5 w-5 text-orange-400" />
                Основные характеристики
              </h3>
              
              <div className="space-y-4">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Car size={20} className="text-orange-400" />
                    <div>
                      <p className="text-sm text-gray-300">Марка и модель</p>
                      <p className="font-semibold text-white">{advertisement.brand} {advertisement.carModel}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-300">Год выпуска</p>
                      <p className="font-semibold text-white">{advertisement.year}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-green-400" />
                    <div>
                      <p className="text-sm text-gray-300">Пробег</p>
                      <p className="font-semibold text-white">{advertisement.mileage.toLocaleString()} км</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Gauge size={20} className="text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-300">Объем двигателя</p>
                      <p className="font-semibold text-white">{advertisement.engineVolume} л</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-400" />
                Технические характеристики
              </h3>
              
              <div className="space-y-4">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Fuel size={20} className="text-green-400" />
                    <div>
                      <p className="text-sm text-gray-300">Тип топлива</p>
                      <p className="font-semibold text-white">{getFuelTypeText(advertisement.fuelType)}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Settings size={20} className="text-orange-400" />
                    <div>
                      <p className="text-sm text-gray-300">Коробка передач</p>
                      <p className="font-semibold text-white">{getTransmissionText(advertisement.transmission)}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-300">Количество владельцев</p>
                      <p className="font-semibold text-white">{advertisement.ownersCount}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Palette size={20} className="text-pink-400" />
                    <div>
                      <p className="text-sm text-gray-300">Цвет</p>
                      <p className="font-semibold text-white">{advertisement.color}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              Описание
            </h3>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {advertisement.description}
            </p>
          </div>

          {/* Контактная информация */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-400" />
              Контактная информация
            </h3>
            <p className="text-gray-200">{advertisement.contacts}</p>
          </div>

          {/* Информация о продавце */}
          {advertisement.user && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Продавец
              </h3>
              <p className="text-gray-200">{advertisement.user.email}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisementDetailModal; 