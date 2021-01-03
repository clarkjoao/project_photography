import * as Jimp from 'jimp'
import * as AWS from 'aws-sdk'
import { Injectable } from '@nestjs/common';
import { UploadQueeDTO } from '../../dtos/uploadquee.dto'
@Injectable()
export class ImagesConvertService {

    public async imageConvert(file):Promise<any>{

        const newBuffer = await Jimp.read(Buffer.from(file.buffer, 'base64'))
        .then(async image => {
        //   const background = await Jimp.read('https://url/background.png');
          const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        //   image.composite(background, 1000, 700);
          image.write("./upload/after.jpg"); 
          image
          .resize(640, Jimp.AUTO)
          .blur(1)
          .quality(25)
          .scale(2, Jimp.RESIZE_BEZIER);
          
          image.write("./upload/before.jpg"); 
          return image.getBufferAsync(Jimp.MIME_JPEG);
        })
        .catch(err => {
          return err;
        });

        file.buffer = newBuffer
        return file;
    }

    public async imageUploadS3(data: UploadQueeDTO):Promise<any>{

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${data.albumID}/${data.imageID}.jpeg`,
        Body: data.file.buffer,
        ContentType: data.file.mimetype,
        ACL: 'public-read'
      };

      const credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
      
      new AWS.S3(credentials).upload(params, function(err, data) {
            if (err) {
                console.error('err',err)
                return err
            }
            return data
        });

      const url =`${process.env.AWS_DEFAULT_URL}/${data.albumID}/${data.imageID}.jpeg`
      return url;
    }

    public async imageDeleteS3(data: UploadQueeDTO){
      
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${data.albumID}/${data.imageID}.jpeg`,
      };

      const credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
      
      return new Promise(()=>{
          return new AWS.S3(credentials).deleteObject(params, function(err, data) {
            if (err) {
                console.error('err',err)
                return err
            }
            return data
        });
      })
    }
}
