import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
  UseGuards,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { UserService } from './users.service';
import {
  AuthLoginDTO,
  AuthSignupDTO,
  AuthUpdateDTO,
} from 'src/middleware/dto/authDto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Guard } from 'src/middleware/guard';

@ApiTags('user api')
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입', description: '유저 정보 추가' })
  @ApiBody({ type: AuthSignupDTO })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: AuthSignupDTO,
  })
  @ApiResponse({ status: 409, description: '회원가입 실패' })
  async create(@Body() signupDTO: AuthSignupDTO) {
    try {
      await this.userService.create(signupDTO);
      return { message: 'Signup success!', userInfo: signupDTO };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인', description: '로그인 정보 확인' })
  @ApiBody({ type: AuthLoginDTO })
  @ApiResponse({ status: 200, description: '로그인 성공', type: AuthLoginDTO })
  @ApiResponse({ status: 401, description: '로그인 실패' })
  async login(@Body() loginDTO: AuthLoginDTO) {
    try {
      const accessToken = await this.userService.login(loginDTO);
      return { message: 'Login success!', accessToken: accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new ConflictException(error.message);
    }
  }

  @Get('/user/:id')
  @UseGuards(Guard)
  @ApiOperation({
    summary: '유저 정보 조회',
    description: '유저 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiResponse({
    status: 200,
    description: '유저 정보 조회 성공',
    type: AuthLoginDTO,
  })
  @ApiResponse({ status: 401, description: '유저 정보 조회 실패' })
  async getUserInfo(@Param('id') id: number) {
    try {
      const getToUser = await this.userService.getUserInfo(id);
      return {
        message: 'User information',
        getToUser: getToUser,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new ConflictException(error.message);
    }
  }

  @Put('/user/update/:id')
  @UseGuards(Guard)
  @ApiOperation({
    summary: '유저 정보 업데이트',
    description: '유저 정보를 업데이트합니다.',
  })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiBody({ type: AuthUpdateDTO })
  @ApiResponse({
    status: 200,
    description: '유저 정보 업데이트 성공',
    type: AuthUpdateDTO,
  })
  @ApiResponse({ status: 401, description: '유저 정보 업데이트 실패' })
  async updateUserInfo(
    @Param('id') id: number,
    @Body() updateDTO: AuthUpdateDTO,
  ) {
    try {
      const updateToUser = await this.userService.updateUserInfo(id, updateDTO);
      return {
        message: 'User information updated successfully',
        user: updateToUser,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new ConflictException(error.message);
    }
  }

  @Put('/user/delete/:id')
  @UseGuards(Guard)
  @ApiOperation({
    summary: '유저 정보 삭제',
    description: '유저 정보를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '유저 정보 삭제 성공' })
  @ApiResponse({ status: 401, description: '유저 정보 삭제 실패' })
  async deleteUserInfo(@Param('id') id: number) {
    try {
      const deleteToUser = await this.userService.deleteUserInfo(id);
      return {
        message: 'User information deleted successfully',
        deleteToUser: deleteToUser,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new ConflictException(error.message);
    }
  }

  @Get('/user/lotto/:id')
  @UseGuards(Guard)
  @ApiOperation({
    summary: '로또 번호 조회',
    description: '유저의 로또 번호를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiResponse({
    status: 200,
    description: '로또 번호 조회 성공',
    type: [Number],
  })
  @ApiResponse({ status: 404, description: '유저가 없음' })
  async getUserLuckyLottoNumber(@Param('id') id: number) {
    try {
      const lottoNumbers = await this.userService.getUserLuckyLottoNumber(id);
      return {
        message: 'User lucky lotto number',
        lottoNumbers: lottoNumbers,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
