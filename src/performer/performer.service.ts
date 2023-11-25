import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfomerEntity } from './performer.entity';
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
        if (perfomerDto.descripcion && perfomerDto.descripcion.length > 100) {
            throw new BadRequestException('la descripcion tiene mas de 100 caracteres');
        }

        const performer = new PerfomerEntity();
        Object.assign(performer, perfomerDto);
        return await this.performerRepository.save(performer);
    }
}