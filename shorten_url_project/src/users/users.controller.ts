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
import { Guard } from 'src/middleware/guard';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
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
  async login(@Body() loginDTO: AuthLoginDTO) {
    try {
      console.log(1, loginDTO);
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
}
