import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { TrackEntity } from '../Track/track.entity';
import { PerformerEntity } from '../Perfomer/performer.entity';
import { AlbumDto } from './album.dto';
import { promises } from 'dns';


@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumRepository : Repository<AlbumEntity>,
        @InjectRepository(TrackEntity)
        private track: Repository<TrackEntity>
        @InjectRepository(PerformerEntity)
        private performer: Repository<PerformerEntity> 
    ){}

    async findall(): Promise<AlbumEntity[]>{
        return await this.albumRepository.find({
            relations:['tracks','performers']
        });
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({ 
            where: { id }, 
            relations: ['tracks', 'performers'] 
        });
    
        return album;
    }

    async create(albumDto: AlbumDto): Promise<AlbumEntity> {
        
        if (albumDto.descripcion  === '') {
            throw new BadRequestException('La descripción del álbum no puede estar vacía.');
        }

        const album = new AlbumEntity();
        Object.assign(album, albumDto);
        return await this.albumRepository.save(album);
    }

    async delete(id: string): Promise<void> {
        const album = await this.albumRepository.findOne({ 
            where: { id }, 
            relations: ['tracks'] 
        });
    
        if (!album) {
            throw new NotFoundException(`no se encontro el album con el id`);
        }

        if (album.tracks && album.tracks.length > 0) {
            throw new BadRequestException('No se puede eliminar un álbum con tracks asociados.');
        }
        await this.albumRepository.delete(id);
    }


    //Asociacion
    async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({
            where: { id: albumId },
            relations: ['performers']
        });
        if (!album) throw new NotFoundException('Album no encontrado.');
    
        const performer = await this.performer.findOne({
            where: { id: performerId }
        });
        if (!performer) throw new NotFoundException('Performer no encontrado.');

        if (album.performers.length >= 3) {
            throw new BadRequestException('Un álbum no puede tener más de tres performers asociados.');
        }
        album.performers.push(performer);
        return this.albumRepository.save(album);
    }

    
}