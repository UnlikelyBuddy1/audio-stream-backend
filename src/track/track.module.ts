import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumRepository } from 'src/album/album.repository';
import { ArtistRepository } from 'src/artist/artist.repository';
import { AuthModule } from 'src/auth/auth.module';
import { GenreRepository } from 'src/genre/genre.repository';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { TrackController } from './track.controller';
import { TrackRepository } from './track.repository';
import { TrackService } from './track.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackRepository, AlbumRepository, ArtistRepository, GenreRepository]),
    AuthModule,
  ],
  controllers: [TrackController],
  providers: [TrackService, UtilitiesService],
})
export class TrackModule {}
