import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Advertisement } from "../lib/api";

interface ModerationCommentDisplayProps {
  advertisement: Advertisement;
}

const ModerationCommentDisplay = ({ advertisement }: ModerationCommentDisplayProps) => {
  if (!advertisement.moderationNote) {
    return null;
  }

  const isRejected = advertisement.status === 'rejected';
  const isApproved = advertisement.status === 'approved';

  return (
    <div className={`rounded-lg p-4 border ${
      isRejected 
        ? 'bg-red-50 border-red-200' 
        : isApproved 
        ? 'bg-green-50 border-green-200'
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-start gap-3">
        {isRejected ? (
          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        ) : isApproved ? (
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
        )}
        
        <div className="flex-1">
          <h4 className={`font-semibold mb-2 ${
            isRejected 
              ? 'text-red-800' 
              : isApproved 
              ? 'text-green-800'
              : 'text-yellow-800'
          }`}>
            {isRejected ? 'Объявление отклонено' : isApproved ? 'Объявление одобрено' : 'Статус модерации'}
          </h4>
          
          <p className={`text-sm ${
            isRejected 
              ? 'text-red-700' 
              : isApproved 
              ? 'text-green-700'
              : 'text-yellow-700'
          }`}>
            {advertisement.moderationNote}
          </p>
          
          {advertisement.moderatedAt && (
            <p className={`text-xs mt-2 ${
              isRejected 
                ? 'text-red-600' 
                : isApproved 
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}>
              Модерация: {new Date(advertisement.moderatedAt).toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerationCommentDisplay; 