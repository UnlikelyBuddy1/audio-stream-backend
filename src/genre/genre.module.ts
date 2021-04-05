import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { GenreRepository } from './genre.repository';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenreRepository]),
    AuthModule
  ],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}
