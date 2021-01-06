import { Processor,OnQueueActive, OnQueueCompleted, Process, OnQueueProgress, OnQueueFailed, OnQueueError } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { AlbunsService } from 'src/albuns/albuns.service';
import { ImagesConvertService } from 'src/shared/services/images-convert/images-convert.service';
import { ImagesDTO } from './dtos/images.dto'
import { UploadQueeDTO } from 'src/shared/dtos/uploadquee.dto'
import { ImagesService } from './images.service';

@Processor('Images')
export class ImagesConsumer {
  constructor(
    private imageConvertService: ImagesConvertService,
    private imagesService: ImagesService,
    private albunsService: AlbunsService
  ){}
  private readonly logger = new Logger(ImagesConsumer.name);

  @Process('create')
  async processImages(job: Job) {

    const newFile = await this.imageConvertService.imageConvert(job.data.file)
    .then((file)=> file)
    .catch((e)=> job.isFailed())    
    
    job.data.file = newFile
    
    const url = await this.imageConvertService.imageUploadS3(job.data)
    .then((url)=> url)
    .catch((e)=> job.isFailed())    
    
    const image: ImagesDTO = {
      id: job.data.imageID,
      link: url,
      isPublished: true
    }
    try{
      this.imagesService.update(job.data.imageID, image)
      this.albunsService.incrasePhotoCount(job.data.albumID, 1)
    }catch(e){
      job.isFailed();
    }
    
    return job.isCompleted();
  }

  @Process('delete')
  async transcode(job: Job) 
  { 
    // Fix-me: Implementar delete no s3
    // this.imageConvertService.imageDeleteS3(job.data)
    // this.albunsService.incrasePhotoCount(job.data.albumID, -1)
  }


  @OnQueueCompleted()
  onCompleted(job: Job){
    this.logger.debug(`Completed job ${job.id} of type ${job.name} with id ${job.data.imageID}`);
  }

  @OnQueueProgress()
  onProgress(job: Job){
    this.logger.warn(`Progress on job ${job.id} of type ${job.name} with id ${job.data.imageID}`);
  }
  @OnQueueError()
  onError(job: Job){
    this.logger.error(`Error on job ${job.id} of type ${job.name} with id ${job.data.imageID}`);
  }

  @OnQueueFailed()
  onFailed(job: Job){
    this.logger.error(`Failure on job ${job.id} of type ${job.name} with id ${job.data.imageID}`);
  }
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with id ${job.data.imageID}`,
    );
  }
}