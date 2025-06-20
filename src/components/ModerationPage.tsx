import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, MapPin, CheckCircle, XCircle, Eye, Loader2, AlertCircle, Shield, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, Advertisement, UpdateAdvertisementData } from "../lib/api";
import { useToast } from "@/hooks/use-toast";
import AdvertisementDetailModal from "./AdvertisementDetailModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ModerationModals from "./ModerationModals";

interface ModerationPageProps {
  isOpen: boolean;
  onClose: () => void;
  onModerationUpdate?: () => void;
}

const ModerationPage = ({ isOpen, onClose, onModerationUpdate }: ModerationPageProps) => {
  const [pendingAdvertisements, setPendingAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState<Advertisement | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
    status: "pending",
    moderationNote: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAdvertisement, setDeletingAdvertisement] = useState<Advertisement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [moderatingAdvertisement, setModeratingAdvertisement] = useState<Advertisement | null>(null);
  const [moderationComment, setModerationComment] = useState("");
  const { toast } = useToast();

  const fetchPendingAdvertisements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPendingAdvertisements();
      
      if (response.success && response.data?.advertisements) {
        setPendingAdvertisements(response.data.advertisements);
      } else {
        setPendingAdvertisements([]);
      }
    } catch (err) {
      console.error('Error fetching pending advertisements:', err);
      setPendingAdvertisements([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch pending advertisements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAdvertisements();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected', moderationNote?: string) => {
    try {
      setIsSubmitting(true);
      await apiService.moderateAdvertisement(id, status, moderationNote);
      
      toast({
        title: "Успешно",
        description: `Объявление ${status === 'approved' ? 'одобрено' : 'отклонено'}!`,
      });

      // Закрываем модальные окна
      setIsApproveModalOpen(false);
      setIsRejectModalOpen(false);
      setModeratingAdvertisement(null);
      setModerationComment("");

      // Обновляем список объявлений на модерации
      fetchPendingAdvertisements();
      
      // Уведомляем родительский компонент об обновлении
      if (onModerationUpdate) {
        onModerationUpdate();
      }
      
      // Добавляем небольшую задержку для обновления основного списка
      setTimeout(() => {
        if (onModerationUpdate) {
          onModerationUpdate();
        }
      }, 500);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось выполнить модерацию",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveClick = (advertisement: Advertisement) => {
    setModeratingAdvertisement(advertisement);
    setModerationComment("");
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (advertisement: Advertisement) => {
    setModeratingAdvertisement(advertisement);
    setModerationComment("");
    setIsRejectModalOpen(true);
  };

  const handleApprove = () => {
    if (moderatingAdvertisement) {
      handleModerate(moderatingAdvertisement.id, 'approved', moderationComment || undefined);
    }
  };

  const handleReject = () => {
    if (moderatingAdvertisement) {
      handleModerate(moderatingAdvertisement.id, 'rejected', moderationComment || undefined);
    }
  };

  const handleEdit = (advertisement: Advertisement) => {
    console.log('🔧 [DEBUG] handleEdit called with advertisement:', advertisement);
    console.log('🔧 [DEBUG] Advertisement ID:', advertisement.id);
    console.log('🔧 [DEBUG] Advertisement brand:', advertisement.brand);
    
    setEditingAdvertisement(advertisement);
    setEditFormData({
      brand: advertisement.brand,
      carModel: advertisement.carModel,
      year: advertisement.year.toString(),
      price: advertisement.price.toString(),
      description: advertisement.description,
      contacts: advertisement.contacts,
      engineVolume: advertisement.engineVolume.toString(),
      mileage: advertisement.mileage.toString(),
      ownersCount: advertisement.ownersCount.toString(),
      isDamaged: advertisement.isDamaged.toString(),
      transmission: advertisement.transmission,
      fuelType: advertisement.fuelType,
      color: advertisement.color,
      status: advertisement.status,
      moderationNote: advertisement.moderationNote || ""
    });
    console.log('🔧 [DEBUG] Setting editFormData:', editFormData);
    setIsEditModalOpen(true);
    console.log('🔧 [DEBUG] Opening edit modal');
    
    // Закрываем модальное окно деталей
    setIsDetailModalOpen(false);
    setSelectedAdvertisement(null);
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

      const updateData: UpdateAdvertisementData = {
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
        moderationNote: editFormData.moderationNote || undefined
      };

      console.log('🔧 [DEBUG] handleSaveEdit: Sending update data:', updateData);

      await apiService.updateAdvertisementByModerator(editingAdvertisement.id, updateData);

      toast({
        title: "Успешно",
        description: "Объявление обновлено!",
      });

      setIsEditModalOpen(false);
      setEditingAdvertisement(null);
      fetchPendingAdvertisements();
      
      // Уведомляем родительский компонент об обновлении
      if (onModerationUpdate) {
        onModerationUpdate();
      }
      
      // Добавляем небольшую задержку для обновления основного списка
      setTimeout(() => {
        if (onModerationUpdate) {
          onModerationUpdate();
        }
      }, 500);
    } catch (error) {
      console.error('🔧 [DEBUG] handleSaveEdit: Error:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось обновить объявление",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      
      fetchPendingAdvertisements();
      
      // Уведомляем родительский компонент об обновлении
      if (onModerationUpdate) {
        onModerationUpdate();
      }
      
      // Добавляем небольшую задержку для обновления основного списка
      setTimeout(() => {
        if (onModerationUpdate) {
          onModerationUpdate();
        }
      }, 500);
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

  const AdvertisementCard = ({ ad }: { ad: Advertisement }) => (
    <div 
      className="bg-black review-glass-border rounded-2xl p-4 cursor-pointer flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={() => {
        setSelectedAdvertisement(ad);
        setIsDetailModalOpen(true);
      }}
    >
      <div className="relative mb-4">
        {ad.photoUrls && ad.photoUrls.length > 0 ? (
          <div className="review-carbon-frame rounded-xl p-1 mb-2">
            <img
              src={ad.photoUrls[0]}
              alt={`${ad.brand} ${ad.carModel}`}
              className="w-full h-48 object-contain rounded-xl"
            />
          </div>
        ) : (
          <div className="review-carbon-frame rounded-xl p-1 mb-2">
            <div className="w-full h-48 bg-neutral-800 rounded-xl flex items-center justify-center">
              <Car className="h-16 w-16 text-neutral-500" />
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-neutral-800 text-white px-2 py-1 rounded-full text-xs font-medium border border-white/20">
          ⏳ На модерации
        </div>
        <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold text-white bg-black/70 border border-white/10">
          {ad.price.toLocaleString()} ₽
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {ad.brand} {ad.carModel}
            </h3>
            <p className="text-neutral-400 text-sm">{ad.year} год</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-neutral-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{ad.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{ad.mileage.toLocaleString()} км</span>
          </div>
        </div>
        <p className="text-neutral-300 line-clamp-2 text-sm">
          {ad.description}
        </p>
        <div className="text-sm text-neutral-400">
          <div className="flex items-center gap-1 mb-1">
            <Phone className="h-4 w-4" />
            <span className="truncate">{ad.contacts}</span>
          </div>
          {ad.user && (
            <div className="text-xs text-neutral-500">
              Продавец: {ad.user.email}
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap pt-2">
          <Button 
            size="sm"
            className="listings-apply-btn flex-1"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAdvertisement(ad);
              setIsDetailModalOpen(true);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Просмотр
          </Button>
          <Button 
            size="sm"
            className="listings-apply-btn flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleApproveClick(ad);
            }}
            disabled={isSubmitting}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Одобрить
          </Button>
          <Button 
            size="sm"
            className="listings-apply-btn flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleRejectClick(ad);
            }}
            disabled={isSubmitting}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Отклонить
          </Button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Модерация <span className="text-neutral-300">объявлений</span>
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

  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Модерация <span className="text-neutral-300">объявлений</span>
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
            <Button onClick={fetchPendingAdvertisements} className="listings-apply-btn flex items-center justify-center gap-2">
              Попробовать снова
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 transition-opacity" />
      )}
      {/* Модерация как плотное окно */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-neutral-900 text-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/15">
            <div className="container mx-auto px-6 py-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">
                  Модерация <span className="text-neutral-300">объявлений</span>
                </h1>
                <Button 
                  onClick={onClose}
                  className="glass-input text-white border-white/30 hover:bg-white/10"
                >
                  Закрыть
                </Button>
              </div>

              {pendingAdvertisements.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-300">Нет объявлений на модерации</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingAdvertisements.map((ad) => (
                    <AdvertisementCard key={ad.id} ad={ad} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Модальные окна (детали, удаление, approve/reject) */}
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingAdvertisement(null);
        }}
        onConfirm={confirmDelete}
        title="Удалить объявление"
        message={`Вы уверены, что хотите удалить объявление "${deletingAdvertisement?.brand} ${deletingAdvertisement?.carModel}"? Это действие нельзя отменить.`}
        isLoading={isDeleting}
      />
      <ModerationModals
        isApproveModalOpen={isApproveModalOpen}
        isRejectModalOpen={isRejectModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setIsRejectModalOpen(false);
          setModeratingAdvertisement(null);
          setModerationComment("");
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        moderationComment={moderationComment}
        setModerationComment={setModerationComment}
        isSubmitting={isSubmitting}
        moderatingAdvertisement={moderatingAdvertisement}
      />
    </>
  );
};

export default ModerationPage; 