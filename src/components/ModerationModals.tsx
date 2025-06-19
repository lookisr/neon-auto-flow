import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Advertisement } from "../lib/api";

interface ModerationModalsProps {
  isApproveModalOpen: boolean;
  isRejectModalOpen: boolean;
  moderatingAdvertisement: Advertisement | null;
  moderationComment: string;
  setModerationComment: (comment: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const ModerationModals = ({
  isApproveModalOpen,
  isRejectModalOpen,
  moderatingAdvertisement,
  moderationComment,
  setModerationComment,
  onApprove,
  onReject,
  onClose,
  isSubmitting
}: ModerationModalsProps) => {
  const isOpen = isApproveModalOpen || isRejectModalOpen;
  const isApproving = isApproveModalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-300 max-w-2xl w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {isApproving ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                Одобрить объявление
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Отклонить объявление
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {moderatingAdvertisement && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                {moderatingAdvertisement.brand} {moderatingAdvertisement.carModel}
              </h4>
              <p className="text-gray-600 text-sm">
                {moderatingAdvertisement.year} год • {moderatingAdvertisement.price.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {moderatingAdvertisement.description}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              {isApproving ? "Комментарий (необязательно)" : "Причина отклонения"}
            </label>
            <Textarea
              value={moderationComment}
              onChange={(e) => setModerationComment(e.target.value)}
              placeholder={
                isApproving 
                  ? "Добавьте комментарий к одобрению..." 
                  : "Укажите причину отклонения объявления..."
              }
              className="bg-gray-50 border-gray-300 text-gray-900 min-h-[100px]"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              {isApproving 
                ? "Комментарий будет виден только модераторам"
                : "Комментарий будет показан автору объявления"
              }
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-300 text-gray-900 hover:bg-gray-100"
            >
              Отмена
            </Button>
            <Button
              onClick={isApproving ? onApprove : onReject}
              disabled={isSubmitting}
              className={
                isApproving 
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isApproving ? "Одобрение..." : "Отклонение..."}
                </>
              ) : (
                <>
                  {isApproving ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Одобрить
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Отклонить
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModerationModals; 