// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.dto';
import { Auth } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    // Find user by email
    const user = await this.authRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async register(registerData: RegisterDto) {
    const { email, password } = registerData;

    // Check if user already exists
    const existingUser = await this.authRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = this.authRepository.create({
      email,
      password: hashedPassword,
    });

    const savedUser = await this.authRepository.save(newUser);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        email: savedUser.email,
      },
    };
  }

  async validateUser(userId: number) {
    return this.authRepository.findOne({ where: { id: userId } });
  }
}
