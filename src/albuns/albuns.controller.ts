import { Body, Controller, Delete, Get, Param, Query, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { AlbunsService } from './albuns.service';
import { AlbunsDTO } from './dtos/albuns.dto'

@Controller('albuns')
export class AlbunsController {
    constructor(private service: AlbunsService) {
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.findById(id);
    }
    
    @Get()
    getAll(@Query('page') page: number) {
        return this.service.findAll(page);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(@Body() albuns: AlbunsDTO, @UploadedFile() file: Express.Multer.File) {
        return this.service.create(albuns, file);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() albuns: AlbunsDTO) {
        return this.service.update(id, albuns);
    }

    @Delete(':id')
    remove(@Param('id') id: string,) {
        return this.service.remove(id);
    }
}
