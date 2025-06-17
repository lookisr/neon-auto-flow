
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold">
            <span className="text-orange-500">AUTO</span>
            <span className="text-gray-900">PRO</span>
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
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    activeItem === item.id
                      ? "text-orange-500"
                      : "text-gray-600 hover:text-gray-900"
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
