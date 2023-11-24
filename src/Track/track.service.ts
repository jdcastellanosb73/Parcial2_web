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
        return await this.trackRepository.find({ relations: ['albums'] });
    }

    async findOne(id: string): Promise<TrackEntity> {
        return await this.trackRepository.findOne({ where: { id }, relations: ['albums'] });
    }

    async create(trackDto: TrackDto): Promise<TrackEntity> {
        if (trackDto.duracion.length <0) {
            throw new BadRequestException('el track tiene que tener una duracion mayor a 0.');
        }

        const track = new TrackEntity();
        Object.assign(track, trackDto);
        return await this.trackRepository.save(track);
    }
}