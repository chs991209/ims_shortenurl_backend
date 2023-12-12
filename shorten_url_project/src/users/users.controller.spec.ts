// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './users.controller';
// import { UserService } from './users.service';
// import {
//   AuthSignupDTO,
//   AuthLoginDTO,
//   AuthUpdateDTO,
// } from 'src/middleware/dto/authDto';
// import { ConflictException, UnauthorizedException } from '@nestjs/common';
// import { User } from './entities/users.entity';

// jest.mock('./users.service');

// describe('UserController', () => {
//   let userController: UserController;
//   let userService: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [UserService],
//     }).compile();

//     userController = module.get<UserController>(UserController);
//     userService = module.get<UserService>(UserService);
//   });

//   it('정의되어야 함', () => {
//     expect(userController).toBeDefined();
//   });

//   describe('create', () => {
//     it('유저를 생성해야 함', async () => {
//       const signupDTO: AuthSignupDTO = {
//         email: 'test@example.com',
//         nickname: 'testuser',
//         password: 'passwOrd!123',
//       };

//       jest.spyOn(userService, 'create').mockResolvedValueOnce({
//         id: 1,
//         email: signupDTO.email,
//         nickname: signupDTO.nickname,
//         password: signupDTO.password,
//         created_at: new Date(),
//         updated_at: new Date(),
//         deleted_at: null,
//       } as User);

//       const result = await userController.create(signupDTO);

//       expect(result).toEqual({
//         message: '가입 성공!',
//         userInfo: signupDTO,
//       });
//     });

//     it('userService.create에서 ConflictException이 발생하면 ConflictException을 던져야 함', async () => {
//       const signupDTO: AuthSignupDTO = {
//         email: 'existing@example.com',
//         nickname: 'existinguser',
//         password: 'password123',
//       };

//       jest
//         .spyOn(userService, 'create')
//         .mockRejectedValueOnce(new ConflictException());

//       await expect(userController.create(signupDTO)).rejects.toThrowError(
//         ConflictException,
//       );
//     });
//   });

//   describe('login', () => {
//     it('성공적인 로그인 시 액세스 토큰을 반환해야 함', async () => {
//       const loginDTO: AuthLoginDTO = {
//         email: 'test@example.com',
//         password: 'passwOrd!123',
//       };

//       // jest.spyOn(userService, 'login').mockResolvedValueOnce();

//       const result = await userController.login(loginDTO);

//       expect(result).toEqual({
//         message: '로그인 성공!',
//         accessToken: 'mockedAccessToken',
//       });
//     });

//     it('로그인 실패 시 UnauthorizedException을 던져야 함', async () => {
//       const loginDTO: AuthLoginDTO = {
//         email: 'nonexistent@example.com',
//         password: 'wrongpassword',
//       };

//       jest
//         .spyOn(userService, 'login')
//         .mockRejectedValueOnce(new UnauthorizedException());

//       await expect(userController.login(loginDTO)).rejects.toThrowError(
//         UnauthorizedException,
//       );
//     });
//   });

//   describe('getUserInfo', () => {
//     it('정상적인 검색 시 사용자 정보를 반환해야 함', async () => {
//       const userId = 1;

//       jest.spyOn(userService, 'getUserInfo').mockResolvedValueOnce({
//         id: userId,
//         email: 'test@example.com',
//         nickname: 'testuser',
//         password: 'mockPassword',
//         created_at: new Date(),
//         updated_at: new Date(),
//         deleted_at: null,
//       } as User);

//       const result = await userController.getUserInfo(userId);

//       expect(result).toEqual({
//         message: '사용자 정보',
//         getToUser: {
//           id: userId,
//           email: 'test@example.com',
//           nickname: 'testuser',
//         },
//       });
//     });

//     it('검색 실패 시 UnauthorizedException을 던져야 함', async () => {
//       const userId = 999;

//       jest
//         .spyOn(userService, 'getUserInfo')
//         .mockRejectedValueOnce(new UnauthorizedException());

//       await expect(userController.getUserInfo(userId)).rejects.toThrowError(
//         UnauthorizedException,
//       );
//     });
//   });

//   describe('updateUserInfo', () => {
//     it('정상적인 업데이트 시 사용자 정보를 업데이트해야 함', async () => {
//       const userId = 1;
//       const updateDTO: AuthUpdateDTO = {
//         nickname: 'updateduser',
//         password: 'newpassword123',
//       };

//       jest.spyOn(userService, 'updateUserInfo').mockResolvedValueOnce({
//         id: userId,
//         email: 'test@example.com',
//         nickname: 'updateduser',
//         password: 'mockPassword',
//         created_at: new Date(),
//         updated_at: new Date(),
//         deleted_at: null,
//       } as User);

//       const result = await userController.updateUserInfo(userId, updateDTO);

//       expect(result).toEqual({
//         message: '사용자 정보가 성공적으로 업데이트되었습니다',
//         user: {
//           id: userId,
//           email: 'test@example.com',
//           nickname: 'updateduser',
//         },
//       });
//     });

//     it('업데이트 실패 시 UnauthorizedException을 던져야 함', async () => {
//       const userId = 999;
//       const updateDTO: AuthUpdateDTO = {
//         nickname: 'updateduser',
//         password: 'newpassword123',
//       };

//       jest
//         .spyOn(userService, 'updateUserInfo')
//         .mockRejectedValueOnce(new UnauthorizedException());

//       await expect(
//         userController.updateUserInfo(userId, updateDTO),
//       ).rejects.toThrowError(UnauthorizedException);
//     });
//   });

//   describe('deleteUserInfo', () => {
//     it('정상적인 삭제 시 사용자 정보를 삭제해야 함', async () => {
//       const userId = 1;

//       jest
//         .spyOn(userService, 'deleteUserInfo')
//         .mockResolvedValueOnce(undefined);

//       const result = await userController.deleteUserInfo(userId);

//       expect(result).toEqual({
//         message: '사용자 정보가 성공적으로 삭제되었습니다',
//         deleteToUser: {
//           id: userId,
//           email: 'test@example.com',
//           nickname: 'testuser',
//         },
//       });
//     });

//     it('삭제 실패 시 UnauthorizedException을 던져야 함', async () => {
//       const userId = 999;

//       jest
//         .spyOn(userService, 'deleteUserInfo')
//         .mockRejectedValueOnce(new UnauthorizedException());

//       await expect(userController.deleteUserInfo(userId)).rejects.toThrowError(
//         UnauthorizedException,
//       );
//     });
//   });
// });
