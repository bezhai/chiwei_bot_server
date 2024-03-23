import { SetMetadata } from '@nestjs/common';

export const WrapResponse = (key: string) => SetMetadata('responseKey', key);
