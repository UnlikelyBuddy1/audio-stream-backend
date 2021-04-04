import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TrackModule,
    AuthModule,
    AlbumModule,],
})
export class AppModule {}