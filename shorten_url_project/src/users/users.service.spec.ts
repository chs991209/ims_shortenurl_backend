import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './users.service';
import { User } from './entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import {
  AuthSignupDTO,
  AuthLoginDTO,
  AuthUpdateDTO,
} from 'src/middleware/dto/authDto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('정의되어야 함', () => {
    expect(userService).toBeDefined();
  });

  describe('사용자 액션', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      nickname: 'testuser',
      password: 'hashedPassword',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('새로운 사용자를 생성해야 함', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);

      const result = await userService.create({
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'testpassword',
      } as AuthSignupDTO);

      expect(result).toEqual(expect.objectContaining({ nickname: 'testuser' }));
    });

    it('성공적인 로그인 시 액세스 토큰을 반환해야 함', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('mockedAccessToken');

      const result = await userService.login({
        email: 'test@example.com',
        password: 'testpassword',
      } as AuthLoginDTO);

      expect(result).toEqual('mockedAccessToken');
    });

    it('성공적인 검색 시 사용자 정보를 반환해야 함', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await userService.getUserInfo(1);

      expect(result).toEqual(
        expect.objectContaining({ email: 'test@example.com' }),
      );
    });

    it('성공적인 업데이트 시 사용자 정보를 업데이트해야 함', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        ...mockUser,
        nickname: 'updateduser',
        password: 'newHashedPassword',
      } as User);

      const result = await userService.updateUserInfo(1, {
        nickname: 'updateduser',
        password: 'newpassword',
      } as AuthUpdateDTO);

      expect(result).toEqual(
        expect.objectContaining({
          nickname: 'updateduser',
          password: 'newHashedPassword',
        }),
      );
    });

    it('성공적인 삭제 시 사용자 정보를 삭제해야 함', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        ...mockUser,
        deleted_at: new Date(),
      } as User);

      const result = await userService.deleteUserInfo(1);

      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          deleted_at: expect.any(Date),
        }),
      );
    });
  });
});
