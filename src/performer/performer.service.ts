import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { AlbumEntity } from '../album/album.entity';
import { PerformerDto } from './performer.dto';

@Injectable()
export class PerformerService {
    constructor(
        @InjectRepository(PerformerEntity)
        private performerRepository: Repository<PerformerEntity>,
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>, 
    ) {}

    async findAll(): Promise<PerformerEntity[]> {
        return await this.performerRepository.find({ relations: ['albums'] });
    }

    async findOne(id: string): Promise<PerformerEntity> {
        return await this.performerRepository.findOne({ where: { id }, relations: ['albums'] });
    }

    async create(perfomerDto: PerformerDto): Promise<PerformerEntity> {
        if (perfomerDto.descripcion && perfomerDto.descripcion.length > 100) {
            throw new BadRequestException('la descripcion tiene mas de 100 caracteres');
        }

        const performer = new PerformerEntity();
        Object.assign(performer, perfomerDto);
        return await this.performerRepository.save(performer);
    }
}