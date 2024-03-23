import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT', 3306),
        username: 'root',
        password: configService.get('MYSQL_ROOT_PASSWORD'),
        database: configService.get('MYSQL_DBNAME'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: configService.get('DATABASE_SYNCHRONIZE') === 'true', // 注意：在生产环境中不要设置为 true
      }),
    }),
  ],
})
export class MysqlModule {}
