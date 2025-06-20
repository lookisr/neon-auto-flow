import { User, IUser } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export class AuthService {
  static async registerUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
    console.log('🔧 [DEBUG] AuthService.registerUser called');
    console.log('🔧 [DEBUG] Email:', email);
    
    // Check if user already exists
    console.log('🔧 [DEBUG] Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('🔧 [DEBUG] User already exists');
      throw new Error('User with this email already exists');
    }
    console.log('🔧 [DEBUG] User does not exist, proceeding with registration');

    // Create new user
    console.log('🔧 [DEBUG] Creating new user...');
    const user = new User({ email, password });
    await user.save();
    console.log('🔧 [DEBUG] User saved to database, ID:', user._id);

    // Generate token
    console.log('🔧 [DEBUG] Generating JWT token...');
    const token = generateToken(user._id.toString(), user.email);
    console.log('🔧 [DEBUG] Token generated successfully');

    return { user, token };
  }

  static async loginUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
    console.log('🔧 [DEBUG] AuthService.loginUser called');
    console.log('🔧 [DEBUG] Email:', email);
    
    // Find user by email
    console.log('🔧 [DEBUG] Finding user by email...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('🔧 [DEBUG] User not found');
      throw new Error('Invalid email or password');
    }
    console.log('🔧 [DEBUG] User found, ID:', user._id);

    // Check password
    console.log('🔧 [DEBUG] Checking password...');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('🔧 [DEBUG] Password invalid');
      throw new Error('Invalid email or password');
    }
    console.log('🔧 [DEBUG] Password valid');

    // Generate token
    console.log('🔧 [DEBUG] Generating JWT token...');
    const token = generateToken(user._id.toString(), user.email);
    console.log('🔧 [DEBUG] Token generated successfully');

    return { user, token };
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    console.log('🔧 [DEBUG] AuthService.getUserById called');
    console.log('🔧 [DEBUG] User ID:', userId);
    
    const user = await User.findById(userId);
    console.log('🔧 [DEBUG] User found:', user ? 'yes' : 'no');
    
    return user;
  }
} 