import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { AlbunsService } from './albuns.service';
import { AlbunsDTO } from './dtos/albuns.dto'

@Controller('albuns')
export class AlbunsController {
    constructor(private service: AlbunsService) {
    }
    @Get(':id')
    get(@Param() params) {
        return this.service.findById(params.id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(@Body() albuns: AlbunsDTO, @UploadedFile() file: Express.Multer.File) {
        return this.service.create(albuns, file);
    }

    @Put()
    update(@Body() albuns: AlbunsDTO) {
        return this.service.update(albuns);
    }

    @Delete(':id')
    remove(@Param() params) {
        return this.service.remove(params.id);
    }
}
