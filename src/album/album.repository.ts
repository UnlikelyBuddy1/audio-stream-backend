import { InternalServerErrorException } from "@nestjs/common";
import { getArrayIfNeeded } from "src/utils/create-entities.utils";
import { Album } from "src/entities/album.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createAlbumDto } from "./dto/create-album-dto";
import { GetAlbumsFilterDto } from "./dto/get-albums-filter.dto";
import { modifyAlbumDto } from "./dto/modify-album-dto";
import { defaultImage } from "src/utils/file-upload.utils";

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {

    async getAlbums(filterDto: GetAlbumsFilterDto, user: User): Promise<Album[]> {
        let {search, index, size} = filterDto;
        index=parseInt(index.toString());
        if(size){size=parseInt(size.toString())}else{size=10;}
        const toSkip = index*size;
        const toTake = size;
        const query = this.createQueryBuilder('album');
        try {
            //query.where('album.userId = :userId', { userId: user.id });

            if(search){
                
                query.where('album.name like :search', {search: `%${search}%`});
            }
            const albums = await query.skip(toSkip).take(toTake).getMany();
            return albums;
        } catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    async createAlbum(createAlbumDto: createAlbumDto, user: User, filename: string): Promise<Album> {
        let { name, artistIds, genreIds } = createAlbumDto;
        const album = new Album();
        album.name = name;
        album.cover = filename ? filename: defaultImage[Math.floor(Math.random() * defaultImage.length)];
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
        //delete album.user;
        return album;
    }

    async modifyAlbum(album: Album, modifyAlbumDto: modifyAlbumDto, user: User, filename: string): Promise<Album>{
        let {name, genreIds, artistIds}= modifyAlbumDto;
        if(name){
            album.name = name;
        } 
        if(filename){
            album.cover=filename;
        }
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
        //delete album.user;
        return album;
    }
}