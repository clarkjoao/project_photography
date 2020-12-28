import { Processor,OnQueueActive, OnQueueCompleted, Process, OnQueueProgress, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ImagesConvertService } from 'src/shared/services/images-convert/images-convert.service';

@Processor('Images')
export class ImagesConsumer {
  constructor(
    private imageConvertService: ImagesConvertService
  ){
  }
  private readonly logger = new Logger(ImagesConsumer.name);
  @Process()
  async processImages(job: Job) {
    this.logger.debug('Start transcoding...');
    const {image} = job.data
    const result = await this.imageConvertService.imageTrate(image)
    return result;
  }

  @OnQueueCompleted()
  onCompleted(job: Job){
    this.logger.log(`Completed job ${job.id} of type ${job.name} with data ${job.data}...`,);
  }

  @OnQueueProgress()
  onProgress(job: Job){
    this.logger.warn(`Progress on job ${job.id} of type ${job.name} with data ${job.data}...`,);
  }

  @OnQueueFailed()
  onFailed(job: Job){
    this.logger.error(`Error on job ${job.id} of type ${job.name} with data ${job.data}...`,);
  }
  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}