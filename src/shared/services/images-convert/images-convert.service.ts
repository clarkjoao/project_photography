import * as Jimp from 'jimp'
import * as AWS from 'aws-sdk'
import { Injectable } from '@nestjs/common';
import { UploadQueeDTO } from '../../dtos/uploadquee.dto'
@Injectable()
export class ImagesConvertService {

    public async imageConvert(file):Promise<any>{

        return new Promise(async(resolver, reject)=>{
            return await Jimp.read(Buffer.from(file.buffer, 'base64'))
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
              file.buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
              return resolver(file)
            })
            .catch(err => {
              return reject(err)
            });
        })
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

      
      
     return new Promise((resolve, reject)=>{
       return  new AWS.S3(credentials).upload(params, function(err) {
          if (err) {
            return reject(err)
          }
          const url =`${process.env.AWS_DEFAULT_URL}/${data.albumID}/${data.imageID}.jpeg`
          return resolve(url)
        });
     })
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
      
   
    return new Promise((resolve,reject)=>{
      return new AWS.S3(credentials).deleteObject(params, function(err, data) {
        if (err) {
            console.error('err',err)
            return reject(err)
        }
        return resolve(data)
      })
    })
    }

    public async emptyFolders(data: UploadQueeDTO){

      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `${data.albumID}`,
      };

      var paramsToDelete = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {Objects:[]}
      }

      const credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }

      const s3 = new AWS.S3(credentials)
    
      return new Promise(async (resolve, reject)=>{
        return s3.listObjects(params, async (err, data) =>{
          if (err){
            return reject(err);
          }
      
          if (data.Contents.length == 0){
            return reject('Not Found')
          }
      
          data.Contents.forEach(function(content) {
            paramsToDelete.Delete.Objects.push({Key: content.Key});
          });
  
          return s3.deleteObjects(paramsToDelete, function(err, data) {
            if (err) {
              return reject(err)
            }
            return resolve(data)
          })
        });
      })
    }
}
