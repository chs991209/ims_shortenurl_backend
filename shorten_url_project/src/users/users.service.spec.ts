// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './users.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
// import {
//   ConflictException,
//   UnauthorizedException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

// // 사용자 엔터티의 목(Mock)
// class MockUserEntity {
//   id: number;
//   email: string;
//   nickname: string;
//   password: string;
//   created_at: Date;
//   updated_at: Date;
//   deleted_at: Date;
// }

// // userRepository의 목(Mock)
// const mockUserRepository = {
//   findOne: jest.fn(),
//   create: jest.fn(),
//   save: jest.fn(),
// };

// // jwtService의 목(Mock)
// const mockJwtService = {
//   sign: jest.fn(() => 'mockToken'),
// };

// describe('UserService', () => {
//   let userService: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getRepositoryToken(MockUserEntity),
//           useValue: mockUserRepository,
//         },
//         { provide: JwtService, useValue: mockJwtService },
//       ],
//     }).compile();

//     userService = module.get<UserService>(UserService);
//   });

//   describe('create', () => {
//     it('닉네임 중복 검사', async () => {
//       const existingNickname = 'existingUser';
//       const signupDTO = {
//         nickname: existingNickname,
//         email: 'test@test.com',
//         password: 'xptmxmzhemWkd!59',
//       };
//       mockUserRepository.findOne.mockResolvedValueOnce({
//         nickname: existingNickname,
//       });
//       expect(mockUserRepository.findOne).toHaveBeenCalledWith({
//         nickname: existingNickname,
//       });
//       it('이메일 중복 검사', async () => {
//         const existingEmail = 'existing@example.com';
//         const signupDTO = {
//           nickname: 'testUser',
//           emil: existingEmail,
//           password: 'xptmxmzhemWkd!59',
//         };
//         mockUserRepository.findOne.mockResolvedValueOnce({
//           email: existingEmail,
//         });
//         await expect(userService.create(signupDTO)).rejects.toThrow(
//           ConflictException,
//         );
//         expect(mockUserRepository.findOne).toHaveBeenCalledWith({
//           email: existingEmail,
//         });
//         it('가입하기', async () => {
//             const signupDTO {
//                 nickname: 'testUser'
//             }
//         })
//       });
//     });
//   });
// });
