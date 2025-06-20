import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kps-auto';

console.log('🔧 [DEBUG] Database config loaded');
console.log('🔧 [DEBUG] MongoDB URI:', MONGODB_URI);

export const connectDB = async (): Promise<void> => {
  console.log('🔧 [DEBUG] connectDB function called');
  try {
    console.log('🔧 [DEBUG] Connecting to MongoDB...');
    console.log('🔧 [DEBUG] MongoDB URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ [SUCCESS] MongoDB connected successfully');
    console.log('🔧 [DEBUG] Database name:', mongoose.connection.name);
    console.log('🔧 [DEBUG] Database host:', mongoose.connection.host);
    console.log('🔧 [DEBUG] Database port:', mongoose.connection.port);
  } catch (error) {
    console.error('❌ [ERROR] MongoDB connection failed:', error);
    console.log('🔧 [DEBUG] MongoDB connection failed, exiting process');
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  console.log('🔧 [DEBUG] disconnectDB function called');
  try {
    console.log('🔧 [DEBUG] Attempting to disconnect from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ [SUCCESS] MongoDB disconnected successfully');
    console.log('🔧 [DEBUG] MongoDB disconnection successful');
  } catch (error) {
    console.error('❌ [ERROR] MongoDB disconnection failed:', error);
    console.log('🔧 [DEBUG] MongoDB disconnection failed');
  }
};

export default {}; 