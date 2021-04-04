import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TrackController } from './track.controller';
import { TrackRepository } from './track.repository';
import { TrackService } from './track.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackRepository]),
    AuthModule
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
