import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/users.module';
import { UserService } from 'src/users/users.service';
import { UserController } from 'src/users/users.controller';
import { User } from 'src/users/entities/users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport.jwt';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule),
    PassportModule,
  ],
  exports: [UserService, JwtStrategy, JwtModule, JwtService],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtService],
})
export class AuthModule {}
