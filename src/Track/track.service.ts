import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';
import { TrackDto } from './track.dto';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private trackRepository: Repository<TrackEntity>,
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>, 
    ) {}

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: ['album'] });
    }    

    async findOne(id: string): Promise<TrackEntity> {
        const track = await this.trackRepository.findOne({ 
            where: { id }, 
            relations: ['album'] 
        });
        return track;
    }     

    async create(trackDto: TrackDto): Promise<TrackEntity> {   
        if (trackDto.duracion <= 0) {
            throw new BadRequestException('La duración del track debe ser un número positivo.');
        }
        const album = await this.albumRepository.findOne({ where: { id: trackDto.albumId } });
        if (!album) {
            throw new NotFoundException(`el Track no tiene un album asociado`);
        }
    
        const track = new TrackEntity();
        track.album = album;
        Object.assign(track, trackDto);
        return await this.trackRepository.save(track);
    }
    
}