import { Request, Response } from 'express';
import { AdvertisementService } from '../services/advertisementService';
import { AuthRequest } from '../types/index.js';

export class AdvertisementController {
  static async createAdvertisement(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔧 [DEBUG] createAdvertisement: Request body:', req.body);
      console.log('🔧 [DEBUG] createAdvertisement: Files:', req.files);
      console.log('🔧 [DEBUG] createAdvertisement: Files count:', req.files ? (Array.isArray(req.files) ? req.files.length : 1) : 0);
      
      const userId = (req as AuthRequest).user?.id;
      const userRole = (req as AuthRequest).user?.role;
      
      console.log('🔧 [DEBUG] createAdvertisement: AuthRequest user:', (req as AuthRequest).user);
      console.log('🔧 [DEBUG] createAdvertisement: Extracted userId:', userId);
      console.log('🔧 [DEBUG] createAdvertisement: User role:', userRole);
      
      if (!userId) {
        console.log('🔧 [DEBUG] createAdvertisement: User not authenticated');
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      // Определяем статус объявления в зависимости от роли пользователя
      const isAdmin = userRole === 'admin' || userRole === 'moderator';
      const status = isAdmin ? 'approved' : 'pending';
      
      console.log('🔧 [DEBUG] createAdvertisement: Advertisement status will be:', status);

      const { 
        brand, 
        model, 
        year, 
        price, 
        description, 
        contacts, 
        engineVolume,
        mileage,
        ownersCount,
        isDamaged,
        transmission,
        fuelType,
        color
      } = req.body;

      // Обработка загруженных файлов
      let photoUrls: string[] = ["/placeholder.svg"];
      const baseUrl = process.env.BASE_URL || 'http://localhost:8800';
      
      if (req.files && Array.isArray(req.files)) {
        console.log('🔧 [DEBUG] createAdvertisement: Processing files:', req.files.map(f => f.filename));
        photoUrls = (req.files as Express.Multer.File[]).map(file => `${baseUrl}/uploads/${file.filename}`);
        console.log('🔧 [DEBUG] createAdvertisement: Generated photoUrls:', photoUrls);
      } else if (req.files && typeof req.files === 'object') {
        // Обработка случая, когда multer возвращает объект с полями
        const filesArray = Object.values(req.files).flat();
        if (filesArray.length > 0) {
          console.log('🔧 [DEBUG] createAdvertisement: Processing files from object:', filesArray.map(f => f.filename));
          photoUrls = (filesArray as Express.Multer.File[]).map(file => `${baseUrl}/uploads/${file.filename}`);
          console.log('🔧 [DEBUG] createAdvertisement: Generated photoUrls:', photoUrls);
        }
      }

      console.log('🔧 [DEBUG] createAdvertisement: Final photoUrls:', photoUrls);

      console.log('🔧 [DEBUG] createAdvertisement: Extracted data:', { 
        brand, 
        model, 
        year, 
        price, 
        description, 
        contacts,
        engineVolume,
        mileage,
        ownersCount,
        isDamaged,
        transmission,
        fuelType,
        color,
        photoUrls
      });
      
      const advertisement = await AdvertisementService.createAdvertisement(userId, {
        brand,
        carModel: model,
        year: parseInt(year),
        price: parseInt(price),
        description,
        contacts,
        photoUrls,
        engineVolume: parseFloat(engineVolume),
        mileage: parseInt(mileage),
        ownersCount: parseInt(ownersCount),
        isDamaged: isDamaged === 'true',
        transmission,
        fuelType,
        color,
        status
      });

      console.log('🔧 [DEBUG] createAdvertisement: Advertisement created successfully:', advertisement._id);

      // Получаем информацию о пользователе для ответа
      const populatedAd = await AdvertisementService.getAdvertisementById(String(advertisement._id));

      res.status(201).json({
        success: true,
        message: 'Advertisement created successfully',
        data: {
          advertisement: {
            id: advertisement._id,
            brand: advertisement.brand,
            carModel: advertisement.carModel,
            year: advertisement.year,
            price: advertisement.price,
            description: advertisement.description,
            contacts: advertisement.contacts,
            photoUrls: advertisement.photoUrls,
            engineVolume: advertisement.engineVolume,
            mileage: advertisement.mileage,
            ownersCount: advertisement.ownersCount,
            isDamaged: advertisement.isDamaged,
            transmission: advertisement.transmission,
            fuelType: advertisement.fuelType,
            color: advertisement.color,
            createdAt: advertisement.createdAt,
            user: (populatedAd?.userId && typeof populatedAd.userId === 'object' && 'email' in populatedAd.userId && 'role' in populatedAd.userId) ? {
              id: populatedAd.userId._id,
              email: (populatedAd.userId as any).email,
              role: (populatedAd.userId as any).role
            } : undefined
          }
        }
      });
    } catch (error) {
      console.error('🔧 [DEBUG] createAdvertisement: Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create advertisement'
      });
    }
  }

  static async getAllAdvertisements(req: Request, res: Response): Promise<void> {
    try {
      const advertisements = await AdvertisementService.getAllAdvertisements();
      
      // Фильтруем только одобренные объявления
      const approvedAdvertisements = advertisements.filter(ad => ad.status === 'approved');
      
      console.log('🔧 [DEBUG] getAllAdvertisements: Raw advertisements:', approvedAdvertisements.map(ad => ({
        id: ad._id,
        brand: ad.brand,
        userId: ad.userId,
        userIdType: typeof ad.userId,
        status: ad.status
      })));
      
      res.status(200).json({
        success: true,
        data: {
          advertisements: approvedAdvertisements.map(ad => ({
            id: ad._id,
            brand: ad.brand,
            carModel: ad.carModel,
            year: ad.year,
            price: ad.price,
            description: ad.description,
            contacts: ad.contacts,
            photoUrls: ad.photoUrls,
            engineVolume: ad.engineVolume,
            mileage: ad.mileage,
            ownersCount: ad.ownersCount,
            isDamaged: ad.isDamaged,
            transmission: ad.transmission,
            fuelType: ad.fuelType,
            color: ad.color,
            status: ad.status,
            moderationNote: ad.moderationNote,
            createdAt: ad.createdAt,
            user: (ad.userId && typeof ad.userId === 'object' && 'email' in ad.userId && 'role' in ad.userId) ? {
              id: ad.userId._id,
              email: (ad.userId as any).email,
              role: (ad.userId as any).role
            } : undefined
          }))
        }
      });
    } catch (error) {
      console.error('Get advertisements error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get advertisements'
      });
    }
  }

  static async getAdvertisementsByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const advertisements = await AdvertisementService.getAdvertisementsByUser(userId);
      
      res.status(200).json({
        success: true,
        data: {
          advertisements: advertisements.map(ad => ({
            id: ad._id,
            brand: ad.brand,
            carModel: ad.carModel,
            year: ad.year,
            price: ad.price,
            description: ad.description,
            contacts: ad.contacts,
            photoUrls: ad.photoUrls,
            engineVolume: ad.engineVolume,
            mileage: ad.mileage,
            ownersCount: ad.ownersCount,
            isDamaged: ad.isDamaged,
            transmission: ad.transmission,
            fuelType: ad.fuelType,
            color: ad.color,
            createdAt: ad.createdAt
          }))
        }
      });
    } catch (error) {
      console.error('Get user advertisements error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user advertisements'
      });
    }
  }

  static async getAdvertisementById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Advertisement ID is required'
        });
        return;
      }

      const advertisement = await AdvertisementService.getAdvertisementById(id);
      
      if (!advertisement) {
        res.status(404).json({
          success: false,
          message: 'Advertisement not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          advertisement: {
            id: advertisement._id,
            brand: advertisement.brand,
            carModel: advertisement.carModel,
            year: advertisement.year,
            price: advertisement.price,
            description: advertisement.description,
            contacts: advertisement.contacts,
            photoUrls: advertisement.photoUrls,
            engineVolume: advertisement.engineVolume,
            mileage: advertisement.mileage,
            ownersCount: advertisement.ownersCount,
            isDamaged: advertisement.isDamaged,
            transmission: advertisement.transmission,
            fuelType: advertisement.fuelType,
            color: advertisement.color,
            createdAt: advertisement.createdAt,
            user: (advertisement.userId && typeof advertisement.userId === 'object' && 'email' in advertisement.userId && 'role' in advertisement.userId) ? {
              id: advertisement.userId._id,
              email: (advertisement.userId as any).email,
              role: (advertisement.userId as any).role
            } : undefined
          }
        }
      });
    } catch (error) {
      console.error('Get advertisement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get advertisement'
      });
    }
  }

  // Методы для модерации
  static async getPendingAdvertisements(req: Request, res: Response): Promise<void> {
    try {
      const advertisements = await AdvertisementService.getPendingAdvertisements();
      
      res.status(200).json({
        success: true,
        data: {
          advertisements: advertisements.map(ad => ({
            id: ad._id,
            brand: ad.brand,
            carModel: ad.carModel,
            year: ad.year,
            price: ad.price,
            description: ad.description,
            contacts: ad.contacts,
            photoUrls: ad.photoUrls,
            engineVolume: ad.engineVolume,
            mileage: ad.mileage,
            ownersCount: ad.ownersCount,
            isDamaged: ad.isDamaged,
            transmission: ad.transmission,
            fuelType: ad.fuelType,
            color: ad.color,
            status: ad.status,
            moderationNote: ad.moderationNote,
            createdAt: ad.createdAt,
            user: (ad.userId && typeof ad.userId === 'object' && 'email' in ad.userId && 'role' in ad.userId) ? {
              id: ad.userId._id,
              email: (ad.userId as any).email,
              role: (ad.userId as any).role
            } : undefined
          }))
        }
      });
    } catch (error) {
      console.error('Get pending advertisements error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get pending advertisements'
      });
    }
  }

  static async moderateAdvertisement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, moderationNote } = req.body;
      const moderatorId = (req as AuthRequest).user?.id; // ID модератора из токена
      
      if (!id || !status) {
        res.status(400).json({
          success: false,
          message: 'Advertisement ID and status are required'
        });
        return;
      }

      if (!['approved', 'rejected'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status must be either "approved" or "rejected"'
        });
        return;
      }

      const advertisement = await AdvertisementService.moderateAdvertisement(id, status, moderationNote, moderatorId);
      
      if (!advertisement) {
        res.status(404).json({
          success: false,
          message: 'Advertisement not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Advertisement ${status}`,
        data: {
          advertisement: {
            id: advertisement._id,
            brand: advertisement.brand,
            carModel: advertisement.carModel,
            year: advertisement.year,
            price: advertisement.price,
            description: advertisement.description,
            contacts: advertisement.contacts,
            photoUrls: advertisement.photoUrls,
            engineVolume: advertisement.engineVolume,
            mileage: advertisement.mileage,
            ownersCount: advertisement.ownersCount,
            isDamaged: advertisement.isDamaged,
            transmission: advertisement.transmission,
            fuelType: advertisement.fuelType,
            color: advertisement.color,
            status: advertisement.status,
            moderationNote: advertisement.moderationNote,
            moderatedBy: advertisement.moderatedBy,
            moderatedAt: advertisement.moderatedAt,
            createdAt: advertisement.createdAt,
            user: (advertisement.userId && typeof advertisement.userId === 'object' && 'email' in advertisement.userId && 'role' in advertisement.userId) ? {
              id: advertisement.userId._id,
              email: (advertisement.userId as any).email,
              role: (advertisement.userId as any).role
            } : undefined
          }
        }
      });
    } catch (error) {
      console.error('Moderate advertisement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to moderate advertisement'
      });
    }
  }

  static async updateAdvertisementByModerator(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log('🔧 [DEBUG] updateAdvertisementByModerator: ID:', id);
      console.log('🔧 [DEBUG] updateAdvertisementByModerator: Update data:', updateData);
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Advertisement ID is required'
        });
        return;
      }

      const advertisement = await AdvertisementService.updateAdvertisementByModerator(id, updateData);
      
      if (!advertisement) {
        res.status(404).json({
          success: false,
          message: 'Advertisement not found'
        });
        return;
      }

      console.log('🔧 [DEBUG] updateAdvertisementByModerator: Advertisement updated successfully');

      res.status(200).json({
        success: true,
        message: 'Advertisement updated successfully',
        data: {
          advertisement: {
            id: advertisement._id,
            brand: advertisement.brand,
            carModel: advertisement.carModel,
            year: advertisement.year,
            price: advertisement.price,
            description: advertisement.description,
            contacts: advertisement.contacts,
            photoUrls: advertisement.photoUrls,
            engineVolume: advertisement.engineVolume,
            mileage: advertisement.mileage,
            ownersCount: advertisement.ownersCount,
            isDamaged: advertisement.isDamaged,
            transmission: advertisement.transmission,
            fuelType: advertisement.fuelType,
            color: advertisement.color,
            status: advertisement.status,
            moderationNote: advertisement.moderationNote,
            createdAt: advertisement.createdAt,
            user: (advertisement.userId && typeof advertisement.userId === 'object' && 'email' in advertisement.userId && 'role' in advertisement.userId) ? {
              id: advertisement.userId._id,
              email: (advertisement.userId as any).email,
              role: (advertisement.userId as any).role
            } : undefined
          }
        }
      });
    } catch (error) {
      console.error('🔧 [DEBUG] updateAdvertisementByModerator: Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update advertisement'
      });
    }
  }

  static async deleteAdvertisement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log('🔧 [DEBUG] deleteAdvertisement: Deleting advertisement with ID:', id);

      const result = await AdvertisementService.deleteAdvertisementByModerator(id);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Advertisement not found'
        });
        return;
      }

      console.log('🔧 [DEBUG] deleteAdvertisement: Advertisement deleted successfully');

      res.status(200).json({
        success: true,
        message: 'Advertisement deleted successfully'
      });
    } catch (error) {
      console.error('🔧 [DEBUG] deleteAdvertisement: Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete advertisement'
      });
    }
  }

  static async deletePhoto(req: Request, res: Response): Promise<void> {
    try {
      const { id, filename } = req.params;
      const userId = (req as AuthRequest).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      // Получаем объявление
      const advertisement = await AdvertisementService.getAdvertisementById(id);
      
      if (!advertisement) {
        res.status(404).json({
          success: false,
          message: 'Advertisement not found'
        });
        return;
      }

      // Проверяем права на удаление фото
      const isOwner = advertisement.userId.toString() === userId;
      const isAdmin = (req as AuthRequest).user?.role === 'admin' || (req as AuthRequest).user?.role === 'moderator';
      
      if (!isOwner && !isAdmin) {
        res.status(403).json({
          success: false,
          message: 'Not authorized to delete photos from this advertisement'
        });
        return;
      }

      // Удаляем фото из массива URL
      const updatedPhotoUrls = advertisement.photoUrls.filter(url => !url.includes(filename));
      
      // Если это было последнее фото, добавляем placeholder
      if (updatedPhotoUrls.length === 0) {
        updatedPhotoUrls.push('/placeholder.svg');
      }

      // Обновляем объявление
      await AdvertisementService.updateAdvertisementByModerator(id, {
        photoUrls: updatedPhotoUrls
      });

      // Пытаемся удалить физический файл
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const uploadsDir = path.join(process.cwd(), 'uploads');
        await fs.unlink(path.join(uploadsDir, filename));
      } catch (error) {
        console.error('Failed to delete physical file:', error);
        // Не возвращаем ошибку клиенту, так как URL уже удален из БД
      }

      res.status(200).json({
        success: true,
        message: 'Photo deleted successfully'
      });
    } catch (error) {
      console.error('Delete photo error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete photo'
      });
    }
  }
} 