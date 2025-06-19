import mongoose, { Document, Schema } from 'mongoose';

interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
}

export interface IAdvertisement extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  brand: string;
  carModel: string;
  year: number;
  price: number;
  description: string;
  contacts: string;
  photoUrls: string[];
  engineVolume: number; // объем двигателя в литрах
  mileage: number; // пробег в км
  ownersCount: number; // количество владельцев
  isDamaged: boolean; // битый/не битый
  transmission: string; // тип коробки передач
  fuelType: string; // тип топлива
  color: string; // цвет автомобиля
  status: 'pending' | 'approved' | 'rejected'; // статус модерации
  moderationNote?: string; // заметка модератора
  moderatedBy?: mongoose.Types.ObjectId; // ID модератора
  moderatedAt?: Date; // дата модерации
  createdAt: Date;
  updatedAt: Date;
}

const advertisementSchema = new Schema<IAdvertisement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  carModel: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  contacts: {
    type: String,
    required: [true, 'Contacts are required'],
    trim: true
  },
  photoUrls: {
    type: [String],
    default: ["/placeholder.svg"],
    validate: {
      validator: function(photos: string[]) {
        return photos.length <= 10;
      },
      message: 'Cannot upload more than 10 photos'
    }
  },
  engineVolume: {
    type: Number,
    required: [true, 'Engine volume is required'],
    min: [0.5, 'Engine volume must be at least 0.5L'],
    max: [10, 'Engine volume cannot exceed 10L']
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage must be positive']
  },
  ownersCount: {
    type: Number,
    required: [true, 'Owners count is required'],
    min: [1, 'Owners count must be at least 1'],
    max: [20, 'Owners count cannot exceed 20']
  },
  isDamaged: {
    type: Boolean,
    required: [true, 'Damage status is required'],
    default: false
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['manual', 'automatic', 'robot', 'variator'],
    default: 'manual'
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['gasoline', 'diesel', 'hybrid', 'electric', 'lpg'],
    default: 'gasoline'
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationNote: {
    type: String,
    trim: true,
    maxlength: [500, 'Moderation note cannot exceed 500 characters']
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
advertisementSchema.index({ userId: 1, createdAt: -1 });
advertisementSchema.index({ brand: 1, carModel: 1 });
advertisementSchema.index({ price: 1 });
advertisementSchema.index({ year: 1 });
advertisementSchema.index({ mileage: 1 });

export const Advertisement = mongoose.model<IAdvertisement>('Advertisement', advertisementSchema); 