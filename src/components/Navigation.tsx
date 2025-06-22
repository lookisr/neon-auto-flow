import { Car, MapPin, MessageSquare, Phone, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_DISPLAY } from "@/config/constants";

interface NavigationProps {
  onKoreaClick: () => void;
  onListingsClick: () => void;
}

const Navigation = ({ onKoreaClick, onListingsClick }: NavigationProps) => {
  const [activeItem, setActiveItem] = useState("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const buttonClasses = "px-5 h-10 flex items-center justify-center rounded-xl bg-white text-black font-bold text-base shadow transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50";
  const mobileButtonClasses = "px-6 h-12 flex items-center justify-center rounded-xl bg-white text-black font-bold text-lg shadow transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10"
      >
        <nav className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Логотип */}
          <a
            href="#hero"
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-white select-none"
          >
            {COMPANY_NAME}
          </a>
          {/* Десктоп-меню */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveItem(item.id);
                      item.onClick?.();
                    }}
                  className={`text-white text-lg font-medium transition-colors duration-200 hover:text-gray-300 px-2 py-1 rounded ${
                    activeItem === item.id ? "text-gray-300" : ""
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <a
                href={`tel:${COMPANY_PHONE}`}
                className={`ml-4 ${buttonClasses}`}
              >
                Позвонить
              </a>
            </li>
            {!isAuthenticated && (
              <li>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`ml-2 ${buttonClasses}`}
                >
                  Войти
                </button>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <button
                  onClick={handleLogout}
                  className={`ml-2 ${buttonClasses}`}
                >
                  Выйти
                </button>
              </li>
            )}
          </ul>
          {/* Мобильное меню */}
          <button
            className="md:hidden flex items-center justify-center p-2 text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Открыть меню"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>
          {/* Мобильное выпадающее меню */}
          {mobileOpen && (
            <div className="absolute top-16 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 shadow-lg md:hidden animate-fade-in-up">
              <ul className="flex flex-col items-center gap-4 py-6">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveItem(item.id);
                        item.onClick?.();
                      }}
                      className={`text-white text-xl font-medium transition-colors duration-200 hover:text-gray-300 px-2 py-1 rounded ${
                        activeItem === item.id ? "text-gray-300" : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <a
                    href={`tel:${COMPANY_PHONE}`}
                    className={`mt-2 ${mobileButtonClasses}`}
                  >
                    Позвонить
                  </a>
                </li>
                {!isAuthenticated && (
                  <li>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className={`mt-2 ${mobileButtonClasses}`}
                    >
                      Войти
                    </button>
                  </li>
                )}
                {isAuthenticated && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className={`mt-2 ${mobileButtonClasses}`}
                    >
                      Выйти
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
      </nav>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navigation;

