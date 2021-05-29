import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Track } from 'src/entities/track.entity';
import { User } from 'src/entities/user.entity';
import { createTrackDto } from 'src/track/dto/create-track.dto';
import { TrackRepository } from 'src/track/track.repository';
import { AlbumRepository } from 'src/album/album.repository';
import { ArtistRepository } from 'src/artist/artist.repository';
import { GenreRepository } from 'src/genre/genre.repository';
import { Genre } from 'src/entities/genre.entity';
import { Album } from 'src/entities/album.entity';
import { Artist } from 'src/entities/artist.entity';
import * as mm from 'music-metadata';
import { decode_base64 } from 'src/utils/file-upload.utils';
import { getArrayIfNeeded } from 'src/utils/create-entities.utils';


@Injectable()
export class UtilitiesService {
    constructor(
        @Inject(forwardRef(() => TrackRepository))
        private trackRepository : TrackRepository,
        @Inject(forwardRef(() => AlbumRepository))
        private albumRepository : AlbumRepository,
        @Inject(forwardRef(() => ArtistRepository))
        private artistRepository : ArtistRepository,
        @Inject(forwardRef(() => GenreRepository))
        private genreRepository : GenreRepository,
    ) { }
    async createTrack(createTrackDto: createTrackDto, user: User, filename: string): Promise<Track> {
        let { title, path ,genreIds, albumIds, artistIds} = createTrackDto;
        let tags= (await mm.parseFile('./files/audio/'+filename)).common;
        title = title ? title: tags.title;
        
        if(genreIds==null){
            genreIds=[];
            for(let entry of tags.genre){
                let result = await this.genreRepository.findOne({where: {name: entry}})
                if(result!=null){
                    genreIds.push((parseInt(result.id)));
                } else {
                    const genre = new Genre();
                    genre.name=entry;
                    try {
                        await genre.save();
                    } catch (error) {
                        throw new InternalServerErrorException(error);
                    }
                    genreIds.push((parseInt(genre.id)));  
                }
            }  
        }

        if(artistIds==null){
            artistIds=[];
            let splitedArtists = tags.artist.split("/");
            for(let entry of splitedArtists){
                let result = await this.artistRepository.findOne({where: {name: entry}})
                if(result!=null){
                    artistIds.push((parseInt(result.id)));
                } else {
                    const artist = new Artist();
                    artist.name=entry;
                    try {
                        await artist.save();
                    } catch (error) {
                        throw new InternalServerErrorException(error);
                    }
                    artistIds.push((parseInt(artist.id)));  
                }
            }  
        }

        if(albumIds==null){
            albumIds=[];
            let result = await this.albumRepository.findOne({where: {name: tags.album}})
            if(result!=null){
                albumIds.push((parseInt(result.id)));
            } else {
                const album = new Album();
                let imagename=decode_base64(tags.picture[0].data, tags.title);
                album.name=tags.album;
                album.cover= imagename;
                if(genreIds){
                    genreIds=getArrayIfNeeded(genreIds);
                    album.genres = genreIds.map(genreIds => ({ id: genreIds } as any));
                }
                if(artistIds){
                    artistIds=getArrayIfNeeded(artistIds);
                    album.artists = artistIds.map(artistIds => ({ id: artistIds } as any));
                } 
                try {
                    await album.save();
                } catch (error) {
                    throw new InternalServerErrorException(error);
                }
                albumIds.push((parseInt(album.id)));  
            }
        }
        createTrackDto= {title, path ,genreIds, albumIds, artistIds};
        return this.trackRepository.createTrack(createTrackDto, user, filename);
    }
}
