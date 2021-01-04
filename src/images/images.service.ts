import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './schemas/image.schemas';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ImagesDTO } from './dtos/images.dto'
import { AlbunsService } from 'src/albuns/albuns.service';
import { UploadQueeDTO } from 'src/shared/dtos/uploadquee.dto'

@Injectable()
export class ImagesService {
    constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    @InjectQueue('Images') private imagesQueue: Queue,
    private albunsService: AlbunsService,
    ) {}
    async create(image: ImagesDTO, file: Express.Multer.File) {
        
        if(!file){
            throw new HttpException('Missing File', HttpStatus.FORBIDDEN);
        }

        const album = await this.albunsService.findById(image.album);

        if(!album){
            throw new HttpException('Album Not found', HttpStatus.NOT_FOUND);
        }

        const newImage = await new this.imageModel(image).save();

        const imageQuee: UploadQueeDTO = {
            albumID: album.id,
            imageID: newImage.id,
            file,
        }

        await this.imagesQueue.add('create', imageQuee)

        return newImage;
    }

    async findById(id: string){
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        const image = await this.imageModel.findOne({_id:id}).exec();

        if(!image){
            throw new HttpException('Image Not found', HttpStatus.NOT_FOUND);
        }
        return image
    }

    async findAllByAlbum(id: string, page: number = 0){
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        const resultsPerPage = parseInt(process.env.QNT_BY_PAGE)||25;

        const result = this.imageModel.find({ album: id })
        .sort({ createdAt: "desc" })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .exec()
        
        return result

    }

    async update(id: string, image: ImagesDTO) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        const imageUpdated = await this.imageModel.findOneAndUpdate({_id: id}, image,{new: true}).exec();

        if (!imageUpdated) {
            throw new HttpException('Image Not found', HttpStatus.NOT_FOUND);
        }
        return imageUpdated;
    }

    async remove(id: string) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        const imageDeleted = await this.imageModel.findOneAndRemove({_id: id}).exec();

        if (!imageDeleted) {
            throw new HttpException('Image Not found', HttpStatus.NOT_FOUND);
        }

        if(imageDeleted.link){

            const imageQuee: UploadQueeDTO = {
                albumID: imageDeleted.id,
                imageID: imageDeleted.album,
            }
    
            await this.imagesQueue.add('delete',imageQuee)
        }
        
        return id;
    }
}
