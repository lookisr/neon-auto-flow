
import { Car, MapPin, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  onKoreaClick: () => void;
  onListingsClick: () => void;
}

const Navigation = ({ onKoreaClick, onListingsClick }: NavigationProps) => {
  const [activeItem, setActiveItem] = useState("home");

  const navItems = [
    { id: "home", icon: Car, label: "Главная" },
    { id: "korea", icon: MapPin, label: "Авто из Кореи", onClick: onKoreaClick },
    { id: "listings", icon: MessageSquare, label: "Объявления", onClick: onListingsClick },
    { id: "contact", icon: Phone, label: "Контакты" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold">
            <span className="text-neon-orange animate-neon-pulse">AUTO</span>
            <span className="text-white">PRO</span>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id);
                    item.onClick?.();
                  }}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    activeItem === item.id
                      ? "text-neon-orange shadow-neon-orange"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
