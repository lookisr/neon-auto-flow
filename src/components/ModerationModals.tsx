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
      <DialogContent className="bg-black review-glass-border max-w-2xl w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            {isApproving ? (
              <>
                <CheckCircle className="h-6 w-6 text-neutral-300" />
                Одобрить объявление
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-neutral-300" />
                Отклонить объявление
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {moderatingAdvertisement && (
            <div className="bg-neutral-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                {moderatingAdvertisement.brand} {moderatingAdvertisement.carModel}
              </h4>
              <p className="text-neutral-400 text-sm">
                {moderatingAdvertisement.year} год • {moderatingAdvertisement.price.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-neutral-400 text-sm mt-1">
                {moderatingAdvertisement.description}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-white">
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
              className="bg-neutral-900 border-white/15 text-white min-h-[100px]"
              disabled={isSubmitting}
            />
            <p className="text-xs text-neutral-500">
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
              className="glass-input text-white border-white/30 hover:bg-white/10"
            >
              Отмена
            </Button>
            <Button
              onClick={isApproving ? onApprove : onReject}
              disabled={isSubmitting}
              className="listings-apply-btn"
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
                      <CheckCircle className="mr-2 h-4 w-4 text-neutral-300" />
                      Одобрить
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4 text-neutral-300" />
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