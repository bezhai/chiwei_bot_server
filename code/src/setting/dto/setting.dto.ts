import { IsDefined, IsNotEmpty } from 'class-validator';

export class SettingDto {
  @IsNotEmpty()
  key: string;
  @IsDefined()
  value: string;
}

export class SettingListDto {
  @IsNotEmpty()
  key: string;
  @IsDefined()
  value: string[];
}
