import { Advertisement, IAdvertisement } from '../models/Advertisement.js';
import mongoose from 'mongoose';

export class AdvertisementService {
  static async createAdvertisement(
    userId: string,
    data: {
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
      status?: 'pending' | 'approved' | 'rejected';
    }
  ): Promise<IAdvertisement> {
    const advertisement = new Advertisement({
      userId: new mongoose.Types.ObjectId(userId),
      ...data
    });

    return await advertisement.save();
  }

  static async getAllAdvertisements(): Promise<IAdvertisement[]> {
    const advertisements = await Advertisement.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .populate('userId', 'email role')
      .exec();
    return advertisements;
  }

  static async getAdvertisementsByUser(userId: string): Promise<IAdvertisement[]> {
    return Advertisement.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  static async getAdvertisementById(id: string): Promise<IAdvertisement | null> {
    return Advertisement.findById(id)
      .populate('userId', 'email')
      .exec();
  }

  static async updateAdvertisement(
    id: string,
    userId: string,
    data: Partial<{
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
    }>
  ): Promise<IAdvertisement | null> {
    return Advertisement.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) },
      data,
      { new: true }
    );
  }

  static async deleteAdvertisement(id: string, userId: string): Promise<boolean> {
    const result = await Advertisement.deleteOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId)
    });
    return result.deletedCount > 0;
  }

  static async deleteAdvertisementByModerator(id: string): Promise<boolean> {
    const result = await Advertisement.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Методы для модерации
  static async getPendingAdvertisements(): Promise<IAdvertisement[]> {
    return Advertisement.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('userId', 'email role')
      .exec();
  }

  static async getAdvertisementsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<IAdvertisement[]> {
    return Advertisement.find({ status })
      .sort({ createdAt: -1 })
      .populate('userId', 'email')
      .exec();
  }

  static async moderateAdvertisement(
    id: string,
    status: 'approved' | 'rejected',
    moderationNote?: string,
    moderatorId?: string
  ): Promise<IAdvertisement | null> {
    const updateData: any = {
      status,
      moderationNote,
      moderatedAt: new Date(),
      updatedAt: new Date()
    };

    if (moderatorId) {
      updateData.moderatedBy = new mongoose.Types.ObjectId(moderatorId);
    }

    return Advertisement.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('userId', 'email');
  }

  static async updateAdvertisementByModerator(
    id: string,
    data: Partial<{
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
      moderationNote: string;
    }>
  ): Promise<IAdvertisement | null> {
    console.log('🔧 [DEBUG] updateAdvertisementByModerator service: ID:', id);
    console.log('🔧 [DEBUG] updateAdvertisementByModerator service: Data:', data);
    
    const result = await Advertisement.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'email');
    
    console.log('🔧 [DEBUG] updateAdvertisementByModerator service: Result:', result);
    
    return result;
  }
} 