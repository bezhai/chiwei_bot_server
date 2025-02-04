import { IsString, IsNotEmpty } from 'class-validator';

export class TransferFileDto {
  @IsString()
  @IsNotEmpty()
  file_key: string;

  @IsString()
  @IsNotEmpty()
  message_id: string;

  @IsString()
  @IsNotEmpty()
  destination: string;
}
