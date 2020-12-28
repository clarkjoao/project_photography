import { Body, Controller, Delete, Get, Param, Post, Put,UploadedFile,UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express'
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
    create(@Body() image: ImagesDTO, @UploadedFile() file) {
        return this.service.create(image, file);
    }

    @Put()
    update(@Body() image: ImagesDTO) {
        return this.service.update(image);
    }

    @Delete(':id')
    remove(@Param() params) {
        return this.service.remove(params.id);
    }
    
}
