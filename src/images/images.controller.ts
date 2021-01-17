import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Query,
    Post,
    Put,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    HttpException, 
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ImagesService } from './images.service';
import { ImagesDTO } from './dtos/images.dto'

@Controller('images')
export class ImagesController {
    constructor(private service: ImagesService) {
    }
    @Get(':id')
    async get(@Param('id') id: string) {

        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return await this.service.findById(id);
    }

    @Get('album/:id')
    async getAllByAlbum(@Param('id') id:string, @Query('page') page: number) {

        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return await this.service.findAllByAlbum(id, page);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createOne(@Body() image: ImagesDTO, @UploadedFile() file: Express.Multer.File) {
        
        if(!file){
            throw new HttpException('Missing File', HttpStatus.FORBIDDEN);
        }

        return await this.service.create(image, file);
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(@Body() image: ImagesDTO, @UploadedFiles() files: Express.Multer.File[]) {
        return files.map(async(file:Express.Multer.File) => this.service.create(image, file))
    }
    
    @Put(':id')
    async update(@Param('id') id: string, @Body() image: ImagesDTO) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return await this.service.update(id, image);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return this.service.remove(id);
    }
    
}
