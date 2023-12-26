import { Module } from '@nestjs/common';
import { ImsWeService } from './ims.we.service';
import { ImsWeController } from './ims.we.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from '../urls/entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  exports: [TypeOrmModule],
  controllers: [ImsWeController],
  providers: [ImsWeService],
})
export class ImsWeModule {}
