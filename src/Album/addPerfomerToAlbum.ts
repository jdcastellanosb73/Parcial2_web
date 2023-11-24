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

//Asociacion de performer a album

async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({
        where: { id: albumId },
        relations: ['perfomers']
    });
    if (!album) throw new NotFoundException('Album no encontrada.');

    const perfomer = await this.performerRepository.findOne({
        where: { id: performerId }
    });
    if (!perfomer) throw new NotFoundException('Perfomer no encontrado.');

    album.aeropuertos.push(perfomer);
    return this.albumRepository.save(album);
}