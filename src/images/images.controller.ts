import { Body, Controller, Delete, Get, Param, Post, Put,UploadedFile,UploadedFiles,UseInterceptors } from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express'
import { ImagesService } from './images.service';
import { ImagesDTO } from './dtos/images.dto'

@Controller('images')
export class ImagesController {
    constructor(private service: ImagesService) {
    }
    @Get('findById/:id')
    get(@Param() params) {
        return this.service.findById(params.id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    createOne(@Body() image: ImagesDTO, @UploadedFile() file) {
        return this.service.create(image, file);
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@Body() image: ImagesDTO, @UploadedFiles() files) {
        files.map(async(file: Buffer) => this.service.create(image, file))
        return;
    }
    
    @Put()
    @UseInterceptors(FileInterceptor('file'))
    update(@Body() image: ImagesDTO, @UploadedFile() file) {
        return this.service.update(image);
    }

    @Delete(':id')
    remove(@Param() params) {
        return this.service.remove(params.id);
    }
    
}
