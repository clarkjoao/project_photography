import * as Jimp from 'jimp'
import * as AWS from 'aws-sdk'
import { Injectable } from '@nestjs/common';
import { ImagesDTO, ImageQueeDTO } from '../../../images/dtos/images.dto'

@Injectable()
export class ImagesConvertService {

    public async imageConvert(file):Promise<any>{
        console.log(file)
        const newBuffer = await Jimp.read(Buffer.from(file.buffer, 'base64'))
        .then(async image => {
        //   const background = await Jimp.read('https://url/background.png');
          const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        //   image.composite(background, 1000, 700);
          image.write("./upload/after.jpg"); 
          image.resize(Jimp.AUTO, 400)
          image.blur(1);
          image.quality(50)
          image.print(font, 200, 200, 'LOGO');
          image.write("./upload/before.jpg"); 
          return image.getBufferAsync(Jimp.MIME_JPEG);
        })
        .catch(err => {
          return err;
        });

        file.buffer = newBuffer
        return file;
    }

    public async uploadS3(data:ImageQueeDTO):Promise<any>{
      const fileType = data.file.originalname.split('.')[1]
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${data.albumID}/${data.imageID}.${fileType}`,
        Body: data.file.buffer,
        ContentType: data.file.mimetype,
        ACL: 'public-read'
      };
      
      let s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const photo = await s3.upload(params, function(err, data) {
            if (err) {
                console.log('err',err)
                return err
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            return data
        });

      const url =`${process.env.AWS_DEFAULT_URL}/${data.albumID}/${data.imageID}.${fileType}`
      return url;
    }
}
