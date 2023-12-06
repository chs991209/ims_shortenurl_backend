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

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('User Actions', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      nickname: 'testuser',
      password: 'hashedPassword',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    it('should create a new user', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);

      const result = await userService.create({
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'testpassword',
      } as AuthSignupDTO);

      expect(result).toEqual(expect.objectContaining({ nickname: 'testuser' }));
    });

    it('should return an access token on successful login', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('mockedAccessToken');

      const result = await userService.login({
        email: 'test@example.com',
        password: 'testpassword',
      } as AuthLoginDTO);

      expect(result).toEqual('mockedAccessToken');
    });

    it('should return user information on successful retrieval', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await userService.getUserInfo(1);

      expect(result).toEqual(
        expect.objectContaining({ email: 'test@example.com' }),
      );
    });

    it('should update user information on successful update', async () => {
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

    it('should delete user information on successful deletion', async () => {
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
