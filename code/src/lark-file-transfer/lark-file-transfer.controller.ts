import { Controller, Post, Body } from '@nestjs/common';
import { WrapResponse } from 'src/common/decorator/wrap-response.decorator';
import { LarkFileTransferService } from './lark-file-transfer.service';
import { TransferFileDto } from './dto/transfer-file.dto';
import { TokenAuth } from 'src/common/decorator/auth.decorator';

@Controller('lark-file-transfer')
export class LarkFileTransferController {
  constructor(
    private readonly larkFileTransferService: LarkFileTransferService,
  ) {}

  @TokenAuth()
  @Post()
  @WrapResponse('url')
  async transferFile(@Body() transferFileDto: TransferFileDto) {
    return this.larkFileTransferService.transferFile(
      transferFileDto.message_id,
      transferFileDto.file_key,
      transferFileDto.destination,
    );
  }
}
