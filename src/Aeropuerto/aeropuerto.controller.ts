import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoDto } from './aeropuerto.dto';

@Controller('airports')
export class AeropuertoController {
    constructor(private aeropuertoService: AeropuertoService) {}

    @Get()
    async findAll() {
        return this.aeropuertoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.aeropuertoService.findOne(id);
    }

    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
        return this.aeropuertoService.create(aeropuertoDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() aeropuertoDto: AeropuertoDto) {
        return this.aeropuertoService.update(id, aeropuertoDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.aeropuertoService.delete(id);
    }
}