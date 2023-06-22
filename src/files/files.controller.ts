import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger/dist';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { Get, UploadedFile } from '@nestjs/common/decorators';
import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common/pipes';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Get()
  findAll() {
    return this.filesService.findAll();
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1054 * 5 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return file;
  }
}
