import { Processor,OnQueueActive, OnQueueCompleted, Process, OnQueueProgress, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ImagesConvertService } from 'src/shared/services/images-convert/images-convert.service';
import { ImagesDTO, ImageQueeDTO } from './dtos/images.dto'
import { ImagesService } from './images.service';

@Processor('Images')
export class ImagesConsumer {
  constructor(
    private imageConvertService: ImagesConvertService,
    private imagesService: ImagesService,
  ){}
  private readonly logger = new Logger(ImagesConsumer.name);

  @Process('create')
  async processImages(job: Job) {
    const newFile = await this.imageConvertService.imageConvert(job.data.file)

    job.data.file = newFile
    const url = await this.imageConvertService.imageUploadS3(job.data)
    
    const image: ImagesDTO = {
      id: job.data.imageID,
      link: url,
      isPublished: true
    }
    
    this.imagesService.update(image)
    
    return {};
  }

  @Process('delete')
  async transcode(job: Job) 
  { 
    await this.imageConvertService.imageDeleteS3(job.data)
  }


  @OnQueueCompleted()
  onCompleted(job: Job){
    this.logger.debug(`Completed job ${job.id} of type ${job.name} with id ${job.data.imageID}`);
  }

  @OnQueueProgress()
  onProgress(job: Job){
    this.logger.warn(`Progress on job ${job.id} of type ${job.name} with id ${job.data.imageID}`);
  }

  @OnQueueFailed()
  onFailed(job: Job){
    this.logger.error(`Error on job ${job.id} of type ${job.name} with id ${job.data.imageID}`);
  }
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with id ${job.data.imageID}`,
    );
  }
}