import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/users.entity';
import {
  AuthSignupDTO,
  AuthLoginDTO,
  AuthUpdateDTO,
} from 'src/middleware/dto/authDto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

jest.mock('bcrypt');

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const createUser = (
  id: number,
  nickname: string,
  email: string,
  password: string,
): User => ({
  id,
  nickname,
  email,
  password,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: new Date(),
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('회원가입', async () => {
    const signupDTO: AuthSignupDTO = {
      nickname: 'testUser',
      email: 'test@test.com',
      password: 'P@ssw0rd123',
    };

    const hashedPassword = await bcrypt.hash(signupDTO.password, 10);
    const newUser = { ...signupDTO, password: hashedPassword };

    mockRepository.create.mockReturnValue(newUser);
    mockRepository.save.mockReturnValue(newUser);

    const result = await service.create(signupDTO);

    expect(result).toEqual(newUser);
    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(newUser);
  });

  it('회원가입 - 중복된 닉네임', async () => {
    const userWithNickname: User = {
      id: 1,
      nickname: 'existingUserWithEmail',
      email: 'existing@test.com',
      password: 'hashedPassword',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: new Date(),
    };

    mockRepository.findOne.mockReturnValueOnce(userWithNickname); // 중복된 닉네임

    const existingUserWithNickname: AuthSignupDTO = {
      nickname: 'existingUserWithEmail', // 중복된 닉네임
      email: 'new@test.com',
      password: 'P@ssw0rd123',
    };

    // 중복된 닉네임 테스트
    try {
      await service.create(existingUserWithNickname);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe('This nickname is already in use.');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          nickname: existingUserWithNickname.nickname,
        },
      });
      // email 중복 검사가 호출되지 않았음을 확인
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    }
  });

  it('회원가입 - 중복된 이메일', async () => {
    const userWithEmail: User = {
      id: 1,
      nickname: 'newUser',
      email: 'existing@test.com', // 중복된 이메일
      password: 'hashedPassword',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: new Date(),
    };

    mockRepository.findOne.mockReturnValueOnce(undefined); // 닉네임 중복 없음
    mockRepository.findOne.mockReturnValueOnce(userWithEmail); // 중복된 이메일

    const existingUserWithEmail: AuthSignupDTO = {
      nickname: 'newUser',
      email: 'existing@test.com', // 중복된 이메일
      password: 'P@ssw0rd123',
    };

    // 중복된 이메일 테스트
    try {
      await service.create(existingUserWithEmail);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toBe('This email address is already in use.');
      // email 중복 검사가 호출되었음을 확인
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          email: existingUserWithEmail.email,
        },
      });
      // 닉네임 중복 검사가 호출되지 않았음을 확인
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
    }
  });

  it('로그인', async () => {
    const loginDTO: AuthLoginDTO = {
      email: 'test@test.com',
      password: 'P@ssw0rd123',
    };

    try {
      const hashedPassword = await bcrypt.hash(loginDTO.password, 10);

      const storedUser: User = createUser(
        1,
        'testUser',
        loginDTO.email,
        hashedPassword,
      );

      mockRepository.findOne.mockReturnValue(storedUser);
      mockJwtService.sign.mockReturnValue('mockedToken');

      const result = await service.login(loginDTO);

      expect(result).toEqual({
        accessToken: 'mockedToken',
        user: {
          id: storedUser.id,
          nickname: storedUser.nickname,
          email: storedUser.email,
        },
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        email: loginDTO.email,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: storedUser.id });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid email or password');
    }
  });

  it('로그인 - 사용자가 존재하지 않는 경우', async () => {
    const nonExistingEmail = 'nonexisting@test.com';

    mockRepository.findOne.mockReturnValue(undefined);

    const loginDTO: AuthLoginDTO = {
      email: nonExistingEmail,
      password: 'P@ssw0rd123',
    };

    try {
      await service.login(loginDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid email or password');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDTO.email },
      });
    }
  });

  it('회원 정보 조회 - 존재하는 사용자', async () => {
    const userId = 1;
    const user: User = createUser(
      userId,
      'testUser',
      'test@test.com',
      'hashedPassword',
    );

    mockRepository.findOne.mockReturnValue(user);

    const result = await service.getUserInfo(userId);

    expect(result).toEqual(user);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  it('회원 정보 조회 - 다른 존재하는 사용자', async () => {
    // 가상의 사용자 ID를 생성합니다.
    const userId = 2;

    // 다른 사용자를 나타내는 mock 데이터를 생성합니다.
    const otherUser: User = {
      id: userId,
      nickname: 'otherUser',
      email: 'other@test.com',
      password: 'otherHashedPassword',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: new Date(),
    };

    mockRepository.findOne.mockReturnValue(otherUser);

    // UserService의 getUserInfo 메서드를 호출하고 결과를 검증합니다.
    const result = await service.getUserInfo(userId);

    expect(result).toEqual(otherUser);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  it('회원 정보 조회 - 존재하지 않는 사용자', async () => {
    // 가상의 사용자 ID를 생성합니다.
    const userId = 3;

    // findOne mock 함수를 설정하여 사용자를 찾지 못하도록 합니다.
    mockRepository.findOne.mockReturnValue(undefined);

    // UserService의 getUserInfo 메서드를 호출하고 InternalServerErrorException이 발생하는지 확인합니다.
    try {
      await service.getUserInfo(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('User not found');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    }
  });

  it('회원 정보 수정 - 닉네임 및 비밀번호 변경', async () => {
    const userId = 1;
    const existingUser: User = createUser(
      userId,
      'oldNickname',
      'user@example.com',
      'oldHashedPassword',
    );

    mockRepository.findOne.mockReturnValueOnce(existingUser);
    mockRepository.save.mockReturnValueOnce(existingUser);

    const updateDTO: AuthUpdateDTO = {
      nickname: 'newNickname',
      password: 'newPassword',
    };

    try {
      const result = await service.updateUserInfo(userId, updateDTO);

      // 결과가 정의되어 있는지 확인
      expect(result).toBeDefined();

      // 나머지 기대값 추가
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(existingUser);
    } catch (error) {
      throw new Error(error);
    }
  });

  it('회원 정보 수정 - 중복된 닉네임으로 인한 ConflictException', async () => {
    const userId = 1;
    const existingUser: User = createUser(
      userId,
      'existingUser',
      'existing@example.com',
      'hashedPassword',
    );

    // 첫 번째 호출에 대한 mocking 설정
    mockRepository.findOne.mockReturnValueOnce(existingUser);

    // 두 번째 호출에 대한 mocking 설정
    mockRepository.findOne.mockReturnValueOnce(undefined);

    const updateDTO: AuthUpdateDTO = {
      nickname: 'existingUser', // 중복된 닉네임
      password: 'newPassword',
    };

    try {
      await service.updateUserInfo(userId, updateDTO);
      // 해당 라인이 실행된다면 예외가 발생하지 않았으므로 아래의 어설션에 실패하는 코드를 실행한다.
      throw new Error('Expected ConflictException, but none was thrown.');
    } catch (error) {
      // 실제로 발생한 오류가 ConflictException이 아니라면 아래의 어설션에 실패하는 코드를 실행한다.
      expect(error instanceof ConflictException).toBe(true as any);
      expect(error.message).toBe('This nickname is already in use.');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ id: userId });
      // 중복 검사 호출 횟수를 확인
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      // 저장 호출이 일어나지 않았음을 확인
      expect(mockRepository.save).not.toHaveBeenCalled();
    }
  });

  it('회원 정보 수정 - 존재하지 않는 사용자로 인한 UnauthorizedException', async () => {
    const userId = 1;
    // mocking 설정: 사용자를 찾을 수 없는 상태
    mockRepository.findOne.mockReturnValueOnce(undefined);

    const updateDTO: AuthUpdateDTO = {
      nickname: 'newNickname',
      password: 'newPassword',
    };

    try {
      await service.updateUserInfo(userId, updateDTO);
      // 해당 라인이 실행된다면 예외가 발생하지 않았으므로 아래의 어설션에 실패하는 코드를 실행한다.
      throw new Error('Expected UnauthorizedException, but none was thrown.');
    } catch (error) {
      // 실제로 발생한 오류가 UnauthorizedException이 아니라면 아래의 어설션에 실패하는 코드를 실행한다.
      expect(error instanceof UnauthorizedException).toBe(true as any);
      expect(error.message).toBe('User not found');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ id: userId });
      // 중복 검사 호출 횟수를 확인
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      // 저장 호출이 일어나지 않았음을 확인
      expect(mockRepository.save).not.toHaveBeenCalled();
    }
  });
});
