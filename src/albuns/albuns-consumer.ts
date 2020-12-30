import { Processor,OnQueueActive, OnQueueCompleted, Process, OnQueueProgress, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ImagesConvertService } from 'src/shared/services/images-convert/images-convert.service';
import { AlbunsService } from './albuns.service';
import { AlbunsDTO } from './dtos/albuns.dto'

@Processor('Albuns')
export class AlbunsConsumer {
  constructor(
    private imageConvertService: ImagesConvertService,
    private albunsService: AlbunsService
  ){}
  private readonly logger = new Logger(AlbunsConsumer.name);

  @Process('create')
  async processImages(job: Job) {
    job.data.file.buffer = Buffer.from(job.data.file.buffer, 'base64')
    const url = await this.imageConvertService.imageUploadS3(job.data)

    const album: AlbunsDTO = {
      id: job.data.albumID,
      link: url,
    }
    
    this.albunsService.update(album)
    
    return {};
  }

  @Process('delete')
  async transcode(job: Job) 
  { 
    // Fix-me: Implementar delete de todo o bucket s3
    // await this.imageConvertService.albumDeleteS3(job.data)
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
    const {data, ...rest} = job
    console.log(rest)
  }
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with id ${job.data.imageID}`,
    );
  }
}