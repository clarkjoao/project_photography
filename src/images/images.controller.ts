import { Body, Controller, Delete, Get, Param, Query, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ImagesService } from './images.service';
import { ImagesDTO } from './dtos/images.dto'

@Controller('images')
export class ImagesController {
    constructor(private service: ImagesService) {
    }
    @Get(':id')
    get(@Param('id') id: string,) {
        return this.service.findById(id);
    }

    @Get('album/:id')
    getAllByAlbum(@Param('id') id:string, @Query('page') page: number) {
        return this.service.findAllByAlbum(id, page);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    createOne(@Body() image: ImagesDTO, @UploadedFile() file: Express.Multer.File) {
        return this.service.create(image, file);
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@Body() image: ImagesDTO, @UploadedFiles() files: Express.Multer.File[]) {
        files.map(async(file:Express.Multer.File) => this.service.create(image, file))
        return;
    }
    
    @Put(':id')
    update(@Param('id') id: string, @Body() image: ImagesDTO) {
        return this.service.update(id, image);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
    
}
