import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { GenreModule } from './genre/genre.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TrackModule,
    AuthModule,
    AlbumModule,
    ArtistModule,
    GenreModule,
    AppModule,
    PlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}