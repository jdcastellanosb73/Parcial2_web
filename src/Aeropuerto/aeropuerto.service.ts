import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoDto } from './aeropuerto.dto';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private aeropuertoRepository: Repository<AeropuertoEntity>,
        @InjectRepository(AerolineaEntity)
        private aerolineaRepository: Repository<AerolineaEntity>, // Inyectar el repositorio de Aerolinea
    ) {}

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({ relations: ['aerolineas'] });
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        return await this.aeropuertoRepository.findOne({ where: { id }, relations: ['aerolineas'] });
    }

    async create(aeropuertoDto: AeropuertoDto): Promise<AeropuertoEntity> {
        if (aeropuertoDto.codigo.length !== 3) {
            throw new BadRequestException('El código del aeropuerto debe tener exactamente tres caracteres.');
        }

        const aeropuerto = new AeropuertoEntity();
        Object.assign(aeropuerto, aeropuertoDto);
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: string, aeropuertoDto: Partial<AeropuertoDto>): Promise<AeropuertoEntity> {
        const existingAeropuerto = await this.aeropuertoRepository.findOne({ where: { id } });
        if (!existingAeropuerto) {
            throw new BadRequestException('Aeropuerto no encontrado.');
        }
        if (aeropuertoDto.codigo && aeropuertoDto.codigo.length !== 3) {
            throw new BadRequestException('El código del aeropuerto debe tener exactamente tres caracteres.');
        }

        Object.assign(existingAeropuerto, aeropuertoDto);
        return await this.aeropuertoRepository.save(existingAeropuerto);
    }

    async delete(id: string): Promise<void> {
        await this.aeropuertoRepository.delete(id);
    }

    //Asociacion
    async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ['aeropuertos']});
        if (!aerolinea) throw new NotFoundException('Aerolinea no encontrada.');
    
        const aeropuerto = aerolinea.aeropuertos.find(aero => aero.id === aeropuertoId);
        if (!aeropuerto) throw new NotFoundException('Aeropuerto no encontrado en la aerolínea.');
    
        return aeropuerto;
    }
}