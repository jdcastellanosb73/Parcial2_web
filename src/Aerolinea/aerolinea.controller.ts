import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { AerolineaDto } from './aerolinea.dto';
"implementar controladores"
@Controller('airlines')
export class AerolineaController {
    constructor(private aerolineaService: AerolineaService) {}

    @Get()
    async findAll() {
        return this.aerolineaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.aerolineaService.findOne(id);
    }

    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
        return this.aerolineaService.create(aerolineaDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() aerolineaDto: AerolineaDto) {
        return this.aerolineaService.update(id, aerolineaDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.aerolineaService.delete(id);
    }
}