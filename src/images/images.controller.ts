import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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
    create(@Body() image: Image) {
        return this.service.create(image);
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
