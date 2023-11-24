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
        @InjectRepository(Albumntity)
        private albumRepository : Repository<AlbumEntity>,
        @InjectRepository(TrackEntity)
        private track: Repository<TrackEntity>

        @InjectRepository(PerformerEntity)
        private performer: Repository<PerformerEntity> 
    ){}

    async findall(): Promise<AlbumEntity[]>{
        return await this.albumRepository.find({
            relations:['track','performer']
        });
    }

    async findOne(id: string): Promise<AlbumEntity>{
        return await this.albumRepository,this.findOne({
            where: { id},
            relations: ['track','performer']
        });
    } 

    async create(AlbumDto: AlbumDto): Promise<AlbumEntity> {
        if (new string(AlbumDto.nombre) == " ") {
            throw new BadRequestException('El nombre no puede estar vacio.');
        }
        if (new string(AlbumDto.descripcion) == " ") {
            throw new BadRequestException('La descripcion no puede estar vacia.');
        }

        const album = new AlbumEntity();
        Object.assign(album, albumDto);
        return await this.albumRepository.save(album);
    }

    async delete(id: string): Promise<void> {
        await this.albumRepository.delete(id);
    }

    
}