import { InternalServerErrorException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { Album } from "src/track/entities/album.entity";
import { Track } from "src/track/entities/track.entity";
import { EntityRepository, Repository } from "typeorm";
import { createAlbumDto } from "./dto/create-album-dto";
import { GetAlbumsFilterDto } from "./dto/get-albums-filter.dto";

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {

    async getAlbums(filterDto: GetAlbumsFilterDto, user: User): Promise<Album[]> {
        const {search} = filterDto;
        const query = this.createQueryBuilder('album');
        try {
            //query.where('album.userId = :userId', { userId: user.id });

            if(search){
                query.where('album.title = :search', {search});
            }
            const albums = await query.getMany();
            console.log(albums);
            return albums;
        } catch(err){
            throw new InternalServerErrorException(err);
        }


    }

    async createAlbum(createAlbumDto: createAlbumDto, user: User): Promise<Album> {
        const { name, artists, tracks } = createAlbumDto;
        const album = new Album();
        album.name = name;
        album.artists = artists;
        album.tracks = tracks;
        await album.save();
        //delete album.user;
        return album;
    }
}