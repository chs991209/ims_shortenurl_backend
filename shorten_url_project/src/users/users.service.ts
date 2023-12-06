import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import {
  AuthSignupDTO,
  AuthLoginDTO,
  AuthUpdateDTO,
} from 'src/middleware/dto/authDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async create(signupDTO: AuthSignupDTO) {
    try {
      const { nickname, email, password } = signupDTO;

      if (await this.findByNickname(nickname)) {
        throw new ConflictException({
          message: 'This nickname is already in use.',
        });
      }

      if (await this.findByEmail(email)) {
        throw new ConflictException({
          message: 'This email address is already in use.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        email,
        nickname,
        password: hashedPassword,
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        // 이미 존재하는 닉네임 또는 이메일의 경우의 예외 처리
        throw error;
      }

      // 기타 예외 처리
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Error creating user',
      });
    }
  }

  // 로그인
  async login(loginDTO: AuthLoginDTO) {
    try {
      const user = await this.findByEmail(loginDTO.email);
      if (!user || !(await bcrypt.compare(loginDTO.password, user.password))) {
        throw new UnauthorizedException({
          message: 'Invalid email or password',
        });
      }

      const payload = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '1d',
      });
      return accessToken;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(error.message);
    }
  }
  //회원정보 조회
  async getUserInfo(id: number) {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  // 회원정보 수정
  async updateUserInfo(id: number, updateDTO: AuthUpdateDTO) {
    try {
      const user = await this.findById(id);

      if (!user) {
        throw new UnauthorizedException({
          message: 'User not found',
        });
      }

      // 닉네임이 변경되었고, 변경된 닉네임이 이미 사용 중인 경우 예외를 던집니다.
      if (
        updateDTO.nickname !== user.nickname &&
        (await this.findByNickname(updateDTO.nickname))
      ) {
        throw new ConflictException({
          message: 'This nickname is already in use.',
        });
      }

      // 비밀번호를 해싱하여 업데이트합니다.
      if (updateDTO.password) {
        const hashedPassword = await bcrypt.hash(updateDTO.password, 10);
        user.password = hashedPassword;
      }

      // 닉네임을 업데이트합니다.
      user.nickname = updateDTO.nickname;

      // 업데이트된 사용자를 저장합니다.
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
  //회원 탈퇴
  async deleteUserInfo(id: number) {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.deleted_at = new Date();
      await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOne({
      where: { nickname },
    });
  }
}
