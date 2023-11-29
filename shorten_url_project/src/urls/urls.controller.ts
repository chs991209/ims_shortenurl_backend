import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
// import { Query } from '@nestjs/common';
// import { BadRequestException } from '@nestjs/common';
// import { HttpCode } from '@nestjs/common';
// import { Redirect } from '@nestjs/common';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // if (+id < 1) {
    //   throw new BadRequestException('id must be larger than 0');
    // }
    return this.urlsService.findOne(+id);
  }
  // @Redirect('https://nestjs.com', 301)
  // @Get('go/docs')
  // getDocs(@Query('version') version: string | number) {
  //   if (version && version === '5') {
  //     return { url: 'https://docs.nestjs.com/v5/' };
  //   }
  // }
  // @HttpCode(201)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlsService.update(+id, updateUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlsService.remove(+id);
  }
}
