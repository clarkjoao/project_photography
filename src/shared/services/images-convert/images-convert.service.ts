import * as Jimp from 'jimp'
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesConvertService {

    public async imageTrate(image):Promise<any>{
        const file = await Jimp.read(Buffer.from(image.buffer, 'base64'))
        .then(async image => {
        //   const background = await Jimp.read('https://url/background.png');
          const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

          image.resize(Jimp.AUTO, 400);
        //   image.composite(background, 1000, 700);
          image.print(font, 500, 500, 'Logo');
          return image.getBufferAsync(Jimp.MIME_JPEG);
        })
        .catch(err => {
          console.log(err)
        });

        return file;

    }
}
