import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGO_INITDB_ROOT_USERNAME')}:${configService.get('MONGO_INITDB_ROOT_PASSWORD')}@${configService.get('MONGO_HOST')}/chiwei?connectTimeoutMS=2000&authSource=admin`,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongodbModule {}
