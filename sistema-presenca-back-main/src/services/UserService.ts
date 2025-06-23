import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Counter } from '../models/Counter';
import { RegisterUserDTO, LoginDTO, UpdateUserDTO } from '../interfaces/user.interface';

export class UserService {
  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  private async getNextRegistrationNumber(): Promise<string> {
    const counter = await Counter.findByIdAndUpdate(
      'registration',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    // Formata o número com zeros à esquerda (ex: 000001)
    return counter.seq.toString().padStart(6, '0');
  }
  public async register(userData: RegisterUserDTO) {
    try {
      // Validar formato do email
      if (!this.validateEmail(userData.email)) {
        throw new Error('Invalid email format');
      }

      // Verificar se o email já existe
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Gerar número de registro
      const registrationNumber = await this.getNextRegistrationNumber();

      // Exigir consentimento LGPD
      if (!userData.acceptedTerms) {
        throw new Error('Consentimento LGPD obrigatório');
      }

      // Criar usuário
      const user = await User.create({
        ...userData,
        registration: registrationNumber,
        password: hashedPassword,
        acceptedTerms: userData.acceptedTerms
      });

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'f4g4mm0n@2025#s3cur3',
        { expiresIn: '24h' }
      );

      // Nunca retorna senha
      const { password, ...userWithoutPassword } = user.toObject();
      return { ...userWithoutPassword, token };
    } catch (error) {
      throw error;
    }
  }

  public async login(loginData: LoginDTO) {
    try {
      // Buscar usuário pelo email
      const user = await User.findOne({ email: loginData.email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'f4g4mm0n@2025#s3cur3',
        { expiresIn: '24h' }
      );


      // Retornar usuário sem a senha e com o token
      // const { password, ...userWithoutPassword } = user.toObject();
      // return { ...userWithoutPassword, token };

      // Retornar apenas o token
      return token;
    } catch (error) {
      throw error;
    }
  }

  public async getUserProfile(userId: string) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async updateUserProfile(userId: string, updateData: UpdateUserDTO) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getAllUsers() {
    try {
      return await User.find().select('-password');
    } catch (error) {
      throw error;
    }
  }

  public async getUsersByType(role: string) {
    try {
      return await User.find({ role }).select('-password');
    } catch (error) {
      throw error;
    }
  }

  public async anonymizeUser(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.name = 'Anônimo';
      user.email = `anon_${user._id}@anon.com`;
      user.password = 'REMOVIDO';
      user.course = '';
      user.registration = '';
      user.fcmToken = undefined;
      user.googleAccessToken = undefined;
      user.googleRefreshToken = undefined;
      user.anonymized = true;
      await user.save();
      return { message: 'User anonymized successfully' };
    } catch (error) {
      throw error;
    }
  }

  public async deleteUser(userId: string) {
    // Para LGPD, não deletar: apenas anonimizar
    return this.anonymizeUser(userId);
  }

  public async updateFcmToken(userId: string, fcmToken: string) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { fcmToken } },
        { new: true }
      ).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return { message: 'FCM token updated successfully' };
    } catch (error) {
      throw error;
    }
  }
}
