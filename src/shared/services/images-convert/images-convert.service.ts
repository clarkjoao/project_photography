import * as Jimp from 'jimp'
import * as AWS from 'aws-sdk'
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesConvertService {

    public async imageTrate(image):Promise<any>{
        const file = await Jimp.read(Buffer.from(image.buffer, 'base64'))
        .then(async image => {
        //   const background = await Jimp.read('https://url/background.png');
          
          const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        //   image.composite(background, 1000, 700);
          image.write("./after.jpg"); 
          image.resize(Jimp.AUTO, 400)
          image.quality(25)
          image.blur(0.5);
          image.print(font, Jimp.AUTO, 200, 'LOGO');
          image.write("./before.jpg"); 
          return image.getBufferAsync(Jimp.MIME_JPEG);
        })
        .catch(err => {
          return err;
        });
        return file;
    }

    public async uploadS3(id, image):Promise<any>{
      let s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        // region: process.env.AWS_REGION
      });

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `cat.jpg`,
        Body: image,
        ContentType: image.mimetype,
        ACL: 'public-read'
      };
     

        // Uploading files to the bucket
      const photo = await s3.upload(params, function(err, data) {
            if (err) {
                console.log('err',err)
                return err
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            return data
        });
      console.log(photo)
      return {};
    }
}
