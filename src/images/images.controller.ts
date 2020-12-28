import { Body, Controller, Delete, Get, Param, Post, Put,UploadedFile,UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express'
import { ImagesService } from './images.service';
import { Image } from './schemas/image.schemas';


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
    create(@Body() image: Image, @UploadedFile() file) {
        return this.service.create(image, file);
    }

    @Put()
    update(@Body() image: Image) {
        return this.service.update(image);
    }

    @Delete(':id')
    remove(@Param() params) {
        return this.service.remove(params.id);
    }
    
}
