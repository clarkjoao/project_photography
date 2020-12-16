import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AlbunsService } from './albuns.service';
import Album from './albuns.dto'

@Controller('albuns')
export class AlbunsController {
    constructor(private service: AlbunsService) {
    }
    @Get('findById/:id')
    get(@Param() params) {
        return this.service.findById(params.id);
    }

    @Post()
    create(@Body() albuns: Album) {
        return this.service.create(albuns);
    }

    @Put()
    update(@Body() albuns: Album) {
        return this.service.update(albuns);
    }

    @Delete(':id')
    remove(@Param() params) {
        return this.service.remove(params.id);
    }
}
