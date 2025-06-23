import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, Filter, MapPin, Search, Loader2, Plus, Shield, AlertCircle, Phone, X, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdvertisements } from "../hooks/useAdvertisements";
import { useAuth } from "../contexts/AuthContext";
import { Advertisement } from "../lib/api";
import AddAdvertisementModal from "./AddAdvertisementModal";
import AuthModal from "./AuthModal";
import AdvertisementDetailModal from "./AdvertisementDetailModal";
import ModerationPage from "./ModerationPage";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiService } from "../lib/api";
import { useToast } from "@/hooks/use-toast";
import { BRANDS } from "@/constants/brands";

interface ListingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const CarCardSkeleton = () => (
  <div className="glass-card rounded-xl p-4 animate-pulse">
    <div className="bg-neutral-700 h-48 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
      <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
      <div className="h-4 bg-neutral-700 rounded w-full"></div>
      <div className="h-4 bg-neutral-700 rounded w-2/3"></div>
    </div>
  </div>
);

const ListingsPage = ({ isOpen, onClose }: ListingsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState<Advertisement | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isModerationOpen, setIsModerationOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdvertisement, setEditingAdvertisement] = useState<Advertisement | null>(null);
  const [editFormData, setEditFormData] = useState({
    brand: "",
    carModel: "",
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
    status: "approved",
    moderationNote: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAdvertisement, setDeletingAdvertisement] = useState<Advertisement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { advertisements, isLoading, error, refetch, getPendingCount } = useAdvertisements();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [sellerType, setSellerType] = useState<'all' | 'company' | 'private'>('all');

  // Проверяем, является ли пользователь админом или модератором
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const handleEdit = (advertisement: Advertisement) => {
    console.log('🔧 [DEBUG] handleEdit called with:', advertisement);
    
    // Проверяем, может ли пользователь редактировать это объявление
    const canEdit = isAdmin || (user && user.id === advertisement.user?.id);
    if (!canEdit) {
      toast({
        title: "Ошибка",
        description: "У вас нет прав на редактирование этого объявления",
        variant: "destructive",
      });
      return;
    }

    setEditingAdvertisement(advertisement);
    setEditFormData({
      brand: advertisement.brand || '',
      carModel: advertisement.carModel || '',
      year: advertisement.year?.toString() || '',
      price: advertisement.price?.toString() || '',
      description: advertisement.description || '',
      contacts: advertisement.contacts || '',
      engineVolume: advertisement.engineVolume?.toString() || '',
      mileage: advertisement.mileage?.toString() || '',
      ownersCount: advertisement.ownersCount?.toString() || '',
      isDamaged: advertisement.isDamaged?.toString() || 'false',
      transmission: advertisement.transmission || 'manual',
      fuelType: advertisement.fuelType || 'gasoline',
      color: advertisement.color || '',
      status: advertisement.status || 'pending',
      moderationNote: advertisement.moderationNote || ''
    });
    
    setIsDetailModalOpen(false); // Закрываем окно деталей
    setIsEditModalOpen(true); // Открываем окно редактирования
    console.log('🔧 [DEBUG] Edit modal state:', { isEditModalOpen: true, editFormData });
  };

  const handleSaveEdit = async () => {
    if (!editingAdvertisement) return;

    try {
      setIsSubmitting(true);
      const year = parseInt(editFormData.year);
      const price = parseInt(editFormData.price);
      const engineVolume = parseFloat(editFormData.engineVolume);
      const mileage = parseInt(editFormData.mileage);
      const ownersCount = parseInt(editFormData.ownersCount);
      
      if (isNaN(year) || isNaN(price) || isNaN(engineVolume) || isNaN(mileage) || isNaN(ownersCount)) {
        throw new Error("Неверный формат данных");
      }

      await apiService.updateAdvertisementByModerator(editingAdvertisement.id, {
        brand: editFormData.brand,
        carModel: editFormData.carModel,
        year,
        price,
        description: editFormData.description,
        contacts: editFormData.contacts,
        engineVolume,
        mileage,
        ownersCount,
        isDamaged: editFormData.isDamaged === 'true',
        transmission: editFormData.transmission,
        fuelType: editFormData.fuelType,
        color: editFormData.color,
        status: editFormData.status as 'pending' | 'approved' | 'rejected',
        moderationNote: editFormData.moderationNote
      });

      toast({
        title: "Успешно",
        description: "Объявление обновлено!",
      });

      setIsEditModalOpen(false);
      setEditingAdvertisement(null);
      updatePendingCount(); // Обновляем счетчик и основной список
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось обновить объявление",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePendingCount = async () => {
    console.log('🔧 [DEBUG] updatePendingCount called');
    if (isAdmin) {
      try {
        const count = await getPendingCount();
        console.log('🔧 [DEBUG] Pending count:', count);
        setPendingCount(count);
      } catch (error) {
        console.log('🔧 [DEBUG] Error fetching pending count:', error);
        // Для компаний показываем ошибку в toast
        if (error instanceof Error) {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить количество объявлений на модерации",
            variant: "destructive",
          });
        }
      }
    }
    // Обновляем основной список объявлений в любом случае
    console.log('🔧 [DEBUG] Refreshing main advertisements list');
    refetch();
  };

  const handleDelete = (advertisement: Advertisement) => {
    setDeletingAdvertisement(advertisement);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingAdvertisement) return;

    try {
      setIsDeleting(true);
      await apiService.deleteAdvertisement(deletingAdvertisement.id);
      
      toast({
        title: "Успешно",
        description: "Объявление удалено!",
      });

      setIsDeleteModalOpen(false);
      setDeletingAdvertisement(null);
      
      // Закрываем модальное окно деталей, если оно открыто
      setIsDetailModalOpen(false);
      setSelectedAdvertisement(null);
      
      refetch();
      updatePendingCount();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось удалить объявление",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Загружаем счетчик объявлений на модерации при открытии страницы
  useEffect(() => {
    if (isAdmin) {
      updatePendingCount();
    }
  }, [isAdmin]);

  // Фильтрация и сортировка объявлений
  const processedAdvertisements = advertisements
    .slice() // Создаем копию, чтобы не мутировать исходный массив
    .sort((a, b) => {
      const aIsCompany = a.user?.email === 'company@kpsauto.ru';
      const bIsCompany = b.user?.email === 'company@kpsauto.ru';
      if (aIsCompany && !bIsCompany) return -1; // a (компания) раньше b (не компания)
      if (!aIsCompany && bIsCompany) return 1;  // b (компания) раньше a (не компания)
      return 0; // Порядок не важен, если оба от компании или оба не от компании
    })
    .filter((ad) => {
      const matchesSearch = ad.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ad.carModel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = selectedBrand === "all" || ad.brand.toLowerCase() === selectedBrand.toLowerCase();

      let matchesPrice = true;
      if (priceRange !== "all") {
        const price = ad.price;
        switch (priceRange) {
          case "under500k":
            matchesPrice = price < 500000;
            break;
          case "500k-1m":
            matchesPrice = price >= 500000 && price < 1000000;
            break;
          case "1m-2m":
            matchesPrice = price >= 1000000 && price < 2000000;
            break;
          case "over2m":
            matchesPrice = price >= 2000000;
            break;
        }
      }

      let matchesSeller = true;
      if (sellerType === 'company') {
        matchesSeller = ad.user && ad.user.role === 'admin';
      } else if (sellerType === 'private') {
        matchesSeller = ad.user && ad.user.role === 'user';
      }
      
      return matchesSearch && matchesBrand && matchesPrice && matchesSeller;
    });

  // Компонент карточки автомобиля
  const CarCard = ({ ad }: { ad: Advertisement }) => {
    // Функция для обработки клика по кнопке звонка
    const handleCallClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Предотвращаем открытие модального окна
      window.location.href = `tel:${ad.contacts}`;
    };

    return (
      <div 
        className="bg-black review-glass-border rounded-2xl cursor-pointer flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
        onClick={() => {
          setSelectedAdvertisement(ad);
          setIsDetailModalOpen(true);
        }}
      >
        <div className="relative w-full h-48">
          {ad.photoUrls && ad.photoUrls.length > 0 && ad.photoUrls[0] !== '/placeholder.svg' ? (
            <img
              src={ad.photoUrls[0]}
              alt={`${ad.brand} ${ad.carModel}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col items-center justify-center text-neutral-600">
              <Car className="h-16 w-16" />
              <p className="mt-2 text-lg font-bold">KPS AUTO</p>
            </div>
          )}
          
          {(ad.user?.role === 'admin' || ad.user?.role === 'moderator') && (
            <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Проверено</span>
            </div>
          )}

          {/* Статус объявления */}
          <div className="absolute top-2 right-2">
            {ad.status === 'pending' && (
              <span className="bg-neutral-800 text-white px-2 py-1 rounded-full text-xs font-medium border border-white/20">
                На модерации
              </span>
            )}
            {ad.status === 'rejected' && (
              <span className="bg-neutral-900 text-white px-2 py-1 rounded-full text-xs font-medium border border-white/20">
                Отклонено
              </span>
            )}
          </div>

          <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full text-lg font-bold text-white bg-black/70 border border-white/10">
            {ad.price.toLocaleString()} ₽
          </div>
        </div>
      
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {ad.brand} {ad.carModel}
                </h3>
                <p className="text-neutral-400 text-sm">{ad.year} год</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-neutral-400 mt-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{ad.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{ad.mileage.toLocaleString()} км</span>
              </div>
            </div>
            
            <p className="text-neutral-300 line-clamp-2 text-sm mt-3">
              {ad.description}
            </p>
          </div>

          {/* Кнопка звонка */}
          <Button 
            onClick={handleCallClick}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold backdrop-blur-sm transition-all mt-4"
          >
            <Phone className="mr-2 h-4 w-4" />
            Позвонить
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => <CarCardSkeleton key={index} />);
    }

    if (processedAdvertisements.length === 0) {
      return (
        <div className="glass-card rounded-xl p-6 text-center col-span-full">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-200">Объявления не найдены</p>
        </div>
      );
    }

    if (sellerType === 'all') {
      const companyAds = processedAdvertisements.filter(ad => ad.user?.email === 'company@kpsauto.ru');
      const privateAds = processedAdvertisements.filter(ad => ad.user?.email !== 'company@kpsauto.ru');
      
      return (
        <>
          {companyAds.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-white col-span-full mt-8 mb-4">Предложения от KPS AUTO</h2>
              {companyAds.map((ad) => <CarCard key={ad.id} ad={ad} />)}
            </>
          )}
          {privateAds.length > 0 && (
            <>
              {/* <h2 className="text-2xl font-bold text-white col-span-full mt-8 mb-4">Частные объявления</h2> */}
              {privateAds.map((ad) => <CarCard key={ad.id} ad={ad} />)}
            </>
          )}
        </>
      );
    } else {
      return processedAdvertisements.map((ad) => <CarCard key={ad.id} ad={ad} />);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Объявления <span className="text-neutral-300">автомобилей</span>
            </h1>
            <Button 
              onClick={onClose}
              variant="outline" 
              className="glass-input text-white border-white/30 hover:bg-white/10"
            >
              Закрыть
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            <span className="ml-2 text-neutral-300">Загрузка объявлений...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !error.toString().includes('Admin or moderator access required')) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Объявления <span className="text-neutral-300">автомобилей</span>
            </h1>
            <Button 
              onClick={onClose}
              variant="outline" 
              className="glass-input text-white border-white/30 hover:bg-white/10"
            >
              Закрыть
            </Button>
          </div>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
            <p className="text-neutral-300 mb-4">Ошибка загрузки: {error}</p>
            <Button onClick={() => window.location.reload()} className="listings-apply-btn flex items-center justify-center gap-2">
              Попробовать снова
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Затемнение фона */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      )}

      {/* Основное окно объявлений */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-full w-full py-8">
              <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-8 gap-2 sm:gap-4">
            <h1 className="text-4xl font-bold text-white text-center sm:text-left w-full sm:w-auto">
              Объявления <span className="text-neutral-300">автомобилей</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {isAuthenticated && (
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-neutral-800 text-white hover:bg-neutral-700 border border-white/20 shadow-none w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить объявление
                </Button>
              )}
              {isAdmin && (
                <Button
                  onClick={() => setIsModerationOpen(true)}
                  className="listings-apply-btn flex items-center gap-2 relative w-full sm:w-auto"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Модерация
                  {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-neutral-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {pendingCount}
                    </span>
                  )}
                </Button>
              )}
              <Button 
                onClick={onClose}
                variant="outline" 
                className="glass-input text-white border-white/30 hover:bg-white/10 w-full sm:w-auto"
              >
                Закрыть
              </Button>
            </div>
          </div>

          {/* Фильтры */}
                <div className="glass-card rounded-xl p-4 sm:p-6 mb-8">
                  <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 mb-6">
                    <button
                      className={`listings-filter-btn px-6 py-2 ${sellerType === 'all' ? 'active' : ''}`}
                      onClick={() => setSellerType('all')}
                    >
                      Все
                    </button>
                    <button
                      className={`listings-filter-btn px-6 py-2 ${sellerType === 'private' ? 'active' : ''}`}
                      onClick={() => setSellerType('private')}
                    >
                      Частные
                    </button>
                    <button
                      className={`listings-filter-btn px-6 py-2 ${sellerType === 'company' ? 'active' : ''}`}
                      onClick={() => setSellerType('company')}
                    >
                      Компании
                    </button>
                  </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Поиск автомобиля..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input pl-10 !bg-[#232323] force-dark-bg text-white placeholder-white"
                />
              </div>
              
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="glass-input !bg-[#232323] force-dark-bg text-white h-11">
                  <SelectValue placeholder="Марка" />
                </SelectTrigger>
                      <SelectContent className="glass-modal">
                        <SelectItem value="all">Все марки</SelectItem>
                        {BRANDS.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value.toLowerCase()}>
                            {brand.label}
                          </SelectItem>
                        ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="glass-input !bg-[#232323] force-dark-bg text-white h-11">
                  <SelectValue placeholder="Цена" />
                </SelectTrigger>
                      <SelectContent className="glass-modal">
                        <SelectItem value="all">Любая цена</SelectItem>
                        <SelectItem value="under500k">До 500 000 ₽</SelectItem>
                        <SelectItem value="500k-1m">500 000 - 1 000 000 ₽</SelectItem>
                        <SelectItem value="1m-2m">1 000 000 - 2 000 000 ₽</SelectItem>
                        <SelectItem value="over2m">Более 2 000 000 ₽</SelectItem>
                </SelectContent>
              </Select>
              
                    <Button className="listings-apply-btn flex items-center justify-center gap-2 w-full">
                <Filter className="mr-2 h-4 w-4" />
                Применить
              </Button>
            </div>
          </div>

                {/* Список объявлений */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-0">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальные окна с повышенным z-index */}
      <div className="z-[60]">
        <AddAdvertisementModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdvertisementCreated={() => {
            refetch();
            updatePendingCount();
          }}
        />
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        
        <AdvertisementDetailModal
          advertisement={selectedAdvertisement}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedAdvertisement(null);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {/* Окно редактирования */}
        {editingAdvertisement && (
          <Dialog open={isEditModalOpen} onOpenChange={(open) => {
            if (!open) {
              setIsEditModalOpen(false);
              setEditingAdvertisement(null);
            }
          }}>
            <DialogContent className="glass-modal sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  Редактирование объявления
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Основная информация */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Марка</Label>
                    <Input
                      id="brand"
                      value={editFormData.brand}
                      onChange={(e) => setEditFormData({...editFormData, brand: e.target.value})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carModel">Модель</Label>
                    <Input
                      id="carModel"
                      value={editFormData.carModel}
                      onChange={(e) => setEditFormData({...editFormData, carModel: e.target.value})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                  </div>
                </div>

                {/* Технические характеристики */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Год выпуска</Label>
                    <Input
                      id="year"
                      type="number"
                      value={editFormData.year}
                      onChange={(e) => setEditFormData({...editFormData, year: e.target.value})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineVolume">Объем двигателя (л)</Label>
                    <Input
                      id="engineVolume"
                      type="number"
                      step="0.1"
                      value={editFormData.engineVolume}
                      onChange={(e) => setEditFormData({...editFormData, engineVolume: e.target.value})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Пробег (км)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={editFormData.mileage}
                      onChange={(e) => setEditFormData({...editFormData, mileage: e.target.value})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Коробка передач</Label>
                    <Select 
                      value={editFormData.transmission} 
                      onValueChange={(value) => setEditFormData({...editFormData, transmission: value})}
                    >
                      <SelectTrigger className="glass-input !bg-[#232323] force-dark-bg text-white h-11">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent className="glass-modal">
                        <SelectItem value="manual">Механическая</SelectItem>
                        <SelectItem value="automatic">Автоматическая</SelectItem>
                        <SelectItem value="robot">Робот</SelectItem>
                        <SelectItem value="variator">Вариатор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Тип топлива</Label>
                    <Select 
                      value={editFormData.fuelType} 
                      onValueChange={(value) => setEditFormData({...editFormData, fuelType: value})}
                    >
                      <SelectTrigger className="glass-input !bg-[#232323] force-dark-bg text-white h-11">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent className="glass-modal">
                        <SelectItem value="gasoline">Бензин</SelectItem>
                        <SelectItem value="diesel">Дизель</SelectItem>
                        <SelectItem value="hybrid">Гибрид</SelectItem>
                        <SelectItem value="electric">Электро</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Цвет</Label>
                    <Input
                      id="color"
                      value={editFormData.color}
                      onChange={(e) => setEditFormData({...editFormData, color: e.target.value})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ownersCount">Количество владельцев</Label>
                    <Input
                      id="ownersCount"
                      type="number"
                      value={editFormData.ownersCount}
                      onChange={(e) => setEditFormData({...editFormData, ownersCount: e.target.value})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDamaged"
                      checked={editFormData.isDamaged === 'true'}
                      onChange={(e) => setEditFormData({...editFormData, isDamaged: e.target.checked.toString()})}
                      className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                    />
                    <Label htmlFor="isDamaged">Битый или не на ходу</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contacts">Контакты</Label>
                  <Input
                    id="contacts"
                    value={editFormData.contacts}
                    onChange={(e) => setEditFormData({...editFormData, contacts: e.target.value})}
                    className="glass-input !bg-[#232323] force-dark-bg text-white placeholder-white"
                  />
                </div>

                {/* Управление фотографиями */}
                {editingAdvertisement.photoUrls && editingAdvertisement.photoUrls.length > 0 && (
                  <div className="space-y-2">
                    <Label>Фотографии</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {editingAdvertisement.photoUrls.map((photoUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photoUrl}
                            alt={`Фото ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={async () => {
                              try {
                                // Получаем имя файла из URL
                                const fileName = photoUrl.split('/').pop();
                                if (!fileName) return;

                                // Удаляем фото
                                await apiService.deletePhoto(editingAdvertisement.id, fileName);
                                
                                // Обновляем список фотографий в состоянии
                                const updatedPhotoUrls = editingAdvertisement.photoUrls?.filter(url => url !== photoUrl) || [];
                                setEditingAdvertisement({
                                  ...editingAdvertisement,
                                  photoUrls: updatedPhotoUrls
                                });

                                toast({
                                  title: "Успешно",
                                  description: "Фотография удалена",
                                });
                              } catch (error) {
                                toast({
                                  title: "Ошибка",
                                  description: "Не удалось удалить фотографию",
                                  variant: "destructive",
                                });
                              }
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Кнопки действий */}
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingAdvertisement(null);
                    }}
                    className="glass-input text-white"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      'Сохранить'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {isAdmin && (
          <ModerationPage
            isOpen={isModerationOpen}
            onClose={() => setIsModerationOpen(false)}
            onModerationUpdate={updatePendingCount}
          />
        )}
        
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Удалить объявление"
          message={`Вы уверены, что хотите удалить объявление "${deletingAdvertisement?.brand} ${deletingAdvertisement?.carModel}"? Это действие нельзя отменить.`}
          isLoading={isDeleting}
        />
      </div>
    </>
  );
};

export default ListingsPage;
