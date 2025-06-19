// NOTE: Для корректной работы укажите VITE_API_BASE_URL в .env файле, например:
// VITE_API_BASE_URL=http://localhost:8800/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8800/api';

export interface CarBuyoutForm {
  brand: string;
  model: string;
  year: number;
  desiredPrice: number;
  phone: string;
}

export interface CarImportForm {
  carType: string;
  budget: number;
  deliveryCity: string;
  name: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
}

export interface Advertisement {
  id: string;
  brand: string;
  carModel: string;
  year: number;
  price: number;
  description: string;
  contacts: string;
  photoUrls: string[];
  engineVolume: number;
  mileage: number;
  ownersCount: number;
  isDamaged: boolean;
  transmission: string;
  fuelType: string;
  color: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
  moderatedBy?: string; // ID модератора
  moderatedAt?: string; // Дата модерации
  createdAt: string;
  user?: User;
}

export interface CreateAdvertisementData {
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  contacts: string;
  photos: File[];
  engineVolume: number;
  mileage: number;
  ownersCount: number;
  isDamaged: boolean;
  transmission: string;
  fuelType: string;
  color: string;
}

export interface UpdateAdvertisementData {
  brand: string;
  carModel: string;
  year: number;
  price: number;
  description: string;
  contacts: string;
  engineVolume: number;
  mileage: number;
  ownersCount: number;
  isDamaged: boolean;
  transmission: string;
  fuelType: string;
  color: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Не добавляем заголовки авторизации для логина и регистрации
    const isAuthRequest = endpoint === '/login' || endpoint === '/register';
    const headers = isAuthRequest 
      ? { ...options.headers }
      : { ...this.getAuthHeaders(), ...options.headers };
    
    console.log('🔧 [DEBUG] Making request to:', url);
    console.log('🔧 [DEBUG] Request headers:', headers);
    console.log('🔧 [DEBUG] Request method:', options.method || 'GET');
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Формы
  async submitCarBuyout(formData: CarBuyoutForm): Promise<ApiResponse<void>> {
    return this.request('/sell-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  }

  async submitCarImport(formData: CarImportForm): Promise<ApiResponse<void>> {
    return this.request('/import-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  }

  // Аутентификация
  async register(email: string, password: string): Promise<AuthResponse> {
    console.log('🔧 [DEBUG] Frontend register called with:', { email, password: password ? '***' : 'undefined' });
    
    const requestBody = { email, password };
    console.log('🔧 [DEBUG] Frontend request body:', JSON.stringify(requestBody));
    
    try {
      const response = await this.request<AuthResponse>('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('🔧 [DEBUG] Frontend register response:', response);
      
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('🔧 [DEBUG] Frontend register error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('🔧 [DEBUG] Frontend login called with:', { email, password: password ? '***' : 'undefined' });
    
    const requestBody = { email, password };
    console.log('🔧 [DEBUG] Frontend request body:', JSON.stringify(requestBody));
    
    try {
      const response = await this.request<AuthResponse>('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('🔧 [DEBUG] Frontend login response:', response);
      
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('🔧 [DEBUG] Frontend login error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/profile');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Объявления
  async getAllAdvertisements(): Promise<ApiResponse<{ advertisements: Advertisement[] }>> {
    return this.request<ApiResponse<{ advertisements: Advertisement[] }>>('/get-ads');
  }

  async getAdvertisementById(id: string): Promise<ApiResponse<{ advertisement: Advertisement }>> {
    return this.request(`/get-ads/${id}`);
  }

  async createAdvertisement(adData: CreateAdvertisementData): Promise<ApiResponse<{ advertisement: Advertisement }>> {
    const formData = new FormData();
    
    // Добавляем текстовые поля
    formData.append('brand', adData.brand);
    formData.append('model', adData.model);
    formData.append('year', adData.year.toString());
    formData.append('price', adData.price.toString());
    formData.append('description', adData.description);
    formData.append('contacts', adData.contacts);
    formData.append('engineVolume', adData.engineVolume.toString());
    formData.append('mileage', adData.mileage.toString());
    formData.append('ownersCount', adData.ownersCount.toString());
    formData.append('isDamaged', adData.isDamaged ? 'true' : 'false');
    formData.append('transmission', adData.transmission);
    formData.append('fuelType', adData.fuelType);
    formData.append('color', adData.color);
    
    // Добавляем файлы
    adData.photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });

    return this.request<ApiResponse<{ advertisement: Advertisement }>>('/post-ad', {
      method: 'POST',
      body: formData,
    });
  }

  async getMyAdvertisements(): Promise<ApiResponse<{ advertisements: Advertisement[] }>> {
    return this.request('/my-ads');
  }

  // Методы для модерации
  async getPendingAdvertisements(): Promise<ApiResponse<{ advertisements: Advertisement[] }>> {
    return this.request('/moderate/pending');
  }

  async moderateAdvertisement(id: string, status: 'approved' | 'rejected', moderationNote?: string): Promise<ApiResponse<{ advertisement: Advertisement }>> {
    return this.request(`/moderate/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, moderationNote }),
    });
  }

  async updateAdvertisementByModerator(id: string, data: UpdateAdvertisementData): Promise<ApiResponse<{ advertisement: Advertisement }>> {
    console.log('🔧 [DEBUG] updateAdvertisementByModerator API: ID:', id);
    console.log('🔧 [DEBUG] updateAdvertisementByModerator API: Data:', data);
    
    return this.request(`/moderate/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deleteAdvertisement(id: string): Promise<ApiResponse<void>> {
    return this.request(`/advertisements/${id}`, {
      method: 'DELETE',
    });
  }

  async deletePhoto(advertisementId: string, fileName: string): Promise<ApiResponse<void>> {
    return this.request(`/advertisements/${advertisementId}/photos/${fileName}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(); 