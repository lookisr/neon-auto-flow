import { Car, MapPin, MessageSquare, Phone, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import { COMPANY_NAME } from "@/config/constants";

interface NavigationProps {
  onKoreaClick: () => void;
  onListingsClick: () => void;
}

const Navigation = ({ onKoreaClick, onListingsClick }: NavigationProps) => {
  const [activeItem, setActiveItem] = useState("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { id: "home", icon: Car, label: "Главная", onClick: handleHomeClick },
    { id: "korea", icon: MapPin, label: "Авто из Кореи", onClick: onKoreaClick },
    { id: "listings", icon: MessageSquare, label: "Объявления", onClick: onListingsClick },
    { id: "contact", icon: Phone, label: "Контакты", onClick: handleContactClick },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-white-glow">
              {COMPANY_NAME}
            </div>
            
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItem(item.id);
                      item.onClick?.();
                    }}
                    className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                      activeItem === item.id
                        ? "text-orange-400 text-white-glow"
                        : "text-gray-200 hover:text-white"
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="flex items-center space-x-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-gray-200">
                      <User size={16} />
                      <span>{user?.email}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-400/50 glass-input"
                    >
                      <LogOut size={16} className="mr-1" />
                      Выйти
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <User size={16} className="mr-1" />
                    Войти
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navigation;

