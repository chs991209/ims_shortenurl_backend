import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import {
  AuthSignupDTO,
  AuthLoginDTO,
  AuthUpdateDTO,
} from 'src/middleware/dto/authDto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/users.entity';

jest.mock('./users.service');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const signupDTO: AuthSignupDTO = {
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'password123',
      };

      jest.spyOn(userService, 'create').mockResolvedValueOnce({
        id: 1,
        email: signupDTO.email,
        nickname: signupDTO.nickname,
        password: signupDTO.password,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      } as User);

      const result = await userController.create(signupDTO);

      expect(result).toEqual({
        message: 'Signup success!',
        userInfo: signupDTO,
      });
    });

    it('should throw ConflictException if userService.create throws ConflictException', async () => {
      const signupDTO: AuthSignupDTO = {
        email: 'existing@example.com',
        nickname: 'existinguser',
        password: 'password123',
      };

      jest
        .spyOn(userService, 'create')
        .mockRejectedValueOnce(new ConflictException());

      await expect(userController.create(signupDTO)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return access token on successful login', async () => {
      const loginDTO: AuthLoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(userService, 'login')
        .mockResolvedValueOnce('mockedAccessToken');

      const result = await userController.login(loginDTO);

      expect(result).toEqual({
        message: 'Login success!',
        accessToken: 'mockedAccessToken',
      });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDTO: AuthLoginDTO = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(userService, 'login')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(userController.login(loginDTO)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('getUserInfo', () => {
    it('should return user information on successful retrieval', async () => {
      const userId = 1;

      jest.spyOn(userService, 'getUserInfo').mockResolvedValueOnce({
        id: userId,
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'mockPassword',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      } as User);

      const result = await userController.getUserInfo(userId);

      expect(result).toEqual({
        message: 'User information',
        getToUser: {
          id: userId,
          email: 'test@example.com',
          nickname: 'testuser',
        },
      });
    });

    it('should throw UnauthorizedException if retrieval fails', async () => {
      const userId = 999;

      jest
        .spyOn(userService, 'getUserInfo')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(userController.getUserInfo(userId)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('updateUserInfo', () => {
    it('should update user information on successful update', async () => {
      const userId = 1;
      const updateDTO: AuthUpdateDTO = {
        nickname: 'updateduser',
        password: 'newpassword123',
      };

      jest.spyOn(userService, 'updateUserInfo').mockResolvedValueOnce({
        id: userId,
        email: 'test@example.com',
        nickname: 'updateduser',
        password: 'mockPassword',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      } as User);

      const result = await userController.updateUserInfo(userId, updateDTO);

      expect(result).toEqual({
        message: 'User information updated successfully',
        user: {
          id: userId,
          email: 'test@example.com',
          nickname: 'updateduser',
        },
      });
    });

    it('should throw UnauthorizedException if update fails', async () => {
      const userId = 999;
      const updateDTO: AuthUpdateDTO = {
        nickname: 'updateduser',
        password: 'newpassword123',
      };

      jest
        .spyOn(userService, 'updateUserInfo')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(
        userController.updateUserInfo(userId, updateDTO),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('deleteUserInfo', () => {
    it('should delete user information on successful deletion', async () => {
      const userId = 1;

      jest
        .spyOn(userService, 'deleteUserInfo')
        .mockResolvedValueOnce(undefined);

      const result = await userController.deleteUserInfo(userId);

      expect(result).toEqual({
        message: 'User information deleted successfully',
        deleteToUser: {
          id: userId,
          email: 'test@example.com',
          nickname: 'testuser',
        },
      });
    });

    it('should throw UnauthorizedException if deletion fails', async () => {
      const userId = 999;

      jest
        .spyOn(userService, 'deleteUserInfo')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(userController.deleteUserInfo(userId)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
