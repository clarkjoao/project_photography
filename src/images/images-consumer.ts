import { Processor,OnQueueActive, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('Images')
export class ImagesConsumer {
  private readonly logger = new Logger(ImagesConsumer.name);
  @Process()
  async processImages(job: Job<unknown>) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}