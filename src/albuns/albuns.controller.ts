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
    UseInterceptors,
    HttpException,
    HttpStatus } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AlbunsService } from './albuns.service';
import { AlbunsDTO } from './dtos/albuns.dto'

@Controller('albuns')
export class AlbunsController {
    constructor(private service: AlbunsService) {
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return await this.service.findById(id);
    }
    
    @Get()
    async getAll(@Query('page') page: number) {
        return await this.service.findAll(page);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() albuns: AlbunsDTO, @UploadedFile() file: Express.Multer.File) {
        return await this.service.create(albuns, file);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() albuns: AlbunsDTO) {

        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }
        
        return await this.service.update(id, albuns);
    }

    @Delete(':id')
    async remove(@Param('id') id: string,) {

        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return await this.service.remove(id);
    }
}
