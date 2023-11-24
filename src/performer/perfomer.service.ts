import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfomerEntity } from './perfomer.entity';
import { AlbumEntity } from '../album/album.entity';
import { PerformerDto } from './performer.dto';

@Injectable()
export class PerfomerService {
    constructor(
        @InjectRepository(PerformerEntity)
        private performerRepository: Repository<PerfomerEntity>,
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>, 
    ) {}

    async findAll(): Promise<PerfomerEntity[]> {
        return await this.performerRepository.find({ relations: ['albums'] });
    }

    async findOne(id: string): Promise<PerfomerEntity> {
        return await this.performerRepository.findOne({ where: { id }, relations: ['albums'] });
    }

    async create(perfomerDto: PerformerDto): Promise<PerfomerEntity> {
        if (perfomerDto.descripcion <= 100) {
            throw new BadRequestException('la descripcion se pasa de 100 caracteristicas');
        }

        const performer = new PerfomerEntity();
        Object.assign(performer, perfomerDto);
        return await this.performerRepository.save(perfomer);
    }
}