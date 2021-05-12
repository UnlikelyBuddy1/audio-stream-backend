import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TrackRepository } from 'src/track/track.repository';
import { StreamController } from './stream.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([TrackRepository]),
        AuthModule
      ],
      controllers: [StreamController],
})
export class StreamModule {}
