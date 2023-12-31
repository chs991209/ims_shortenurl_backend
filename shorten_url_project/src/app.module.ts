import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlsModule } from './urls/urls.module';
import { UserModule } from 'src/users/users.module';
import { AuthModule } from 'src/middleware/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ImsWeModule } from './ims.we/ims.we.module';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [`${__dirname}/**/entities/*.entity.{ts,js}`],
      synchronize: false,
      logging: true,
    }),
    UserModule,
    UrlsModule,
    AuthModule,
    ImsWeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
