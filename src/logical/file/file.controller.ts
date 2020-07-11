import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Inject,
} from '@nestjs/common';
import {
  FilesInterceptor,
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(@Inject(FileService) private readonly fileService: FileService) {}

  /**
   * 批量上传文件
   * 最好同时只让传入一种类型，或者目前只让传入txt与image
   * @param files
   */
  @Post('txt')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFile(@UploadedFiles() files) {
    // let txtArr = [];
    // let imgArr = [];
    // files.forEach(file => {
    //   if (file.mimetype === 'text/plain') {
    //     txtArr.push(file);
    //   } else if (file.mimetype.split('/')[0] === 'image') {
    //     imgArr.push(file);
    //   }
    // });
    // console.log(txtArr, imgArr);
    // this.fileService.txt();
  }
}
