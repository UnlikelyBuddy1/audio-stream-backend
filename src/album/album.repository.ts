import { InternalServerErrorException } from "@nestjs/common";
import { Album } from "src/entities/album.entity";
import { User } from "src/entities/user.entity";
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
                query.where('album.name = :search', {search});
            }
            const albums = await query.getMany();
            console.log(albums);
            return albums;
        } catch(err){
            throw new InternalServerErrorException(err);
        }


    }

    async createAlbum(createAlbumDto: createAlbumDto, user: User): Promise<Album> {
        const { name, artistIds, trackIds } = createAlbumDto;
        const album = new Album();
        album.name = name;
        if(artistIds){
            album.artists = Array.from(artistIds).map(artistIds => ({ id: artistIds } as any));
        }
        if(trackIds){
            console.log(trackIds.map(trackIds => ({id: trackIds} as any)));
            album.tracks = trackIds.map(trackIds => ({id: trackIds} as any));
        }
        try {
            await album.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        //delete album.user;
        return album;
    }
}