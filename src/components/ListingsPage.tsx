
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, Filter, MapPin, Search } from "lucide-react";
import { useState } from "react";

interface ListingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const ListingsPage = ({ isOpen, onClose }: ListingsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const companyCards = [
    {
      id: 1,
      image: "/placeholder.svg",
      title: "Toyota Camry 2020",
      price: "2 350 000 ₽",
      year: "2020",
      mileage: "45 000 км",
      location: "Москва",
      isCompany: true
    },
    {
      id: 2,
      image: "/placeholder.svg", 
      title: "Hyundai Sonata 2019",
      price: "1 890 000 ₽",
      year: "2019",
      mileage: "62 000 км",
      location: "Владивосток",
      isCompany: true
    },
    {
      id: 3,
      image: "/placeholder.svg",
      title: "Kia Optima 2021",
      price: "2 650 000 ₽", 
      year: "2021",
      mileage: "28 000 км",
      location: "Санкт-Петербург",
      isCompany: true
    }
  ];

  const userCards = [
    {
      id: 4,
      image: "/placeholder.svg",
      title: "Honda Accord 2018",
      price: "1 750 000 ₽",
      year: "2018", 
      mileage: "78 000 км",
      location: "Екатеринбург",
      isCompany: false,
      seller: "Алексей П."
    },
    {
      id: 5,
      image: "/placeholder.svg",
      title: "Mazda 6 2017",
      price: "1 540 000 ₽",
      year: "2017",
      mileage: "95 000 км", 
      location: "Новосибирск",
      isCompany: false,
      seller: "Мария К."
    }
  ];

  const CarCard = ({ car }: { car: any }) => (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-lg border border-gray-700 rounded-2xl overflow-hidden hover:border-neon-orange/50 transition-all duration-300 group">
      <div className="relative">
        <img 
          src={car.image} 
          alt={car.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {car.isCompany && (
          <div className="absolute top-4 left-4 bg-neon-green/90 text-black px-3 py-1 rounded-full text-sm font-semibold">
            ✓ Проверено
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/80 text-neon-red px-3 py-1 rounded-full text-sm font-bold">
          {car.price}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-orange transition-colors">
          {car.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-neon-blue" />
            <span>{car.year} год</span>
          </div>
          <div className="flex items-center gap-2">
            <Car size={16} className="text-neon-orange" />
            <span>{car.mileage}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-neon-green" />
            <span>{car.location}</span>
          </div>
          {!car.isCompany && (
            <div className="text-gray-400">
              Продавец: {car.seller}
            </div>
          )}
        </div>
        
        <Button className="w-full bg-neon-red hover:bg-neon-red/80 text-white">
          Подробнее
        </Button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Объявления <span className="text-neon-orange">автомобилей</span>
          </h1>
          <Button 
            onClick={onClose}
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            Закрыть
          </Button>
        </div>

        {/* Фильтры */}
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Поиск автомобиля..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue placeholder="Марка" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="toyota">Toyota</SelectItem>
                <SelectItem value="hyundai">Hyundai</SelectItem>
                <SelectItem value="kia">Kia</SelectItem>
                <SelectItem value="honda">Honda</SelectItem>
                <SelectItem value="mazda">Mazda</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue placeholder="Цена" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="0-1000000">До 1 млн ₽</SelectItem>
                <SelectItem value="1000000-2000000">1-2 млн ₽</SelectItem>
                <SelectItem value="2000000-3000000">2-3 млн ₽</SelectItem>
                <SelectItem value="3000000+">От 3 млн ₽</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-neon-orange hover:bg-neon-orange/80 text-white">
              <Filter className="mr-2 h-4 w-4" />
              Применить
            </Button>
          </div>
        </div>

        {/* Вкладки */}
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700">
            <TabsTrigger 
              value="company" 
              className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green text-white"
            >
              От компании ({companyCards.length})
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue text-white"
            >
              Частные ({userCards.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="company" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyCards.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="mt-8">
            <div className="mb-6 text-center">
              <div className="bg-neon-blue/20 border border-neon-blue/50 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-white mb-4">
                  Для просмотра частных объявлений необходима регистрация
                </p>
                <Button className="bg-neon-blue hover:bg-neon-blue/80 text-white">
                  Зарегистрироваться бесплатно
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
              {userCards.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ListingsPage;
