import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const { login, register } = useAuth();
  const { toast } = useToast();

  const clearErrors = () => {
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    console.log('🔧 [DEBUG] AuthModal handleSubmit called');
    console.log('🔧 [DEBUG] Form data:', JSON.stringify(formData));
    console.log('🔧 [DEBUG] Mode:', mode);
    
    // Валидация полей
    const errors: typeof fieldErrors = {};
    
    if (!formData.email) {
      errors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Введите корректный email";
    }
    
    if (!formData.password) {
      errors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      errors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (mode === 'register' && (!formData.confirmPassword || formData.confirmPassword !== formData.password)) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        console.log('🔧 [DEBUG] Calling register with:', { email: formData.email, password: formData.password ? '***' : 'undefined' });
        await register(formData.email, formData.password);
        toast({
          title: "Успешно",
          description: "Регистрация завершена!",
        });
      } else {
        console.log('🔧 [DEBUG] Calling login with:', { email: formData.email, password: formData.password ? '***' : 'undefined' });
        await login(formData.email, formData.password);
        toast({
          title: "Успешно",
          description: "Вход выполнен!",
        });
      }
      
      // Очистка формы
      setFormData({ email: "", password: "", confirmPassword: "" });
      clearErrors();
      onClose();
    } catch (error) {
      console.log('🔧 [DEBUG] Auth error:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Произошла ошибка";
      
      // Обработка специфических ошибок
      if (errorMessage.includes('уже зарегистрирован') || errorMessage.includes('already exists')) {
        setFieldErrors({ email: "Пользователь с таким email уже зарегистрирован" });
      } else if (
        errorMessage.includes('неверный пароль') ||
        errorMessage.includes('user not found') ||
        errorMessage.toLowerCase().includes('invalid credentials')
      ) {
        setFieldErrors({ password: "Неверный email или пароль" });
      } else {
        setFieldErrors({ general: "Произошла ошибка. Пожалуйста, попробуйте ещё раз." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password' | 'confirmPassword', value: string) => {
    setFormData({...formData, [field]: value});
    // Очищаем ошибку поля при вводе
    if (fieldErrors[field]) {
      setFieldErrors({...fieldErrors, [field]: undefined});
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center text-white-glow">
            {mode === 'register' ? 'Регистрация' : 'Вход'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fieldErrors.general && (
            <div className="glass-card rounded-xl p-4 bg-red-500/20 border-red-500/30">
              <p className="text-red-400 text-center">{fieldErrors.general}</p>
        </div>
          )}

            <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email
              </Label>
                <Input
                id="email"
                  type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="glass-input text-white placeholder-gray-300"
                  placeholder="your@email.com"
                disabled={isSubmitting}
                required
                />
              </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Пароль
              </Label>
                <Input
                id="password"
                  type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="glass-input text-white placeholder-gray-300"
                placeholder="Минимум 6 символов"
                disabled={isSubmitting}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">
                  Подтвердите пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="glass-input text-white placeholder-gray-300"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  required
                />
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
              <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-neutral-800 !text-white hover:bg-neutral-700 border border-white/20 shadow-none w-full"
              >
              {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'register' ? 'Регистрация...' : 'Вход...'}
                  </>
                ) : (
                mode === 'register' ? 'Зарегистрироваться' : 'Войти'
                )}
              </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                {mode === 'login' 
                  ? 'Нет аккаунта? Зарегистрироваться' 
                  : 'Уже есть аккаунт? Войти'
                }
              </button>
            </div>
      </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal; 