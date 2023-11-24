import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
"implementar controladores en conjunto."
@Controller('airlines')
export class AerolineaAeropuertoController {
    constructor(private aerolineaService: AerolineaService) {}

    @Post(':aerolineaId/airports/:aeropuertoId')
    async addAirportToAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return this.aerolineaService.addAirportToAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/airports')
    async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string) {
        return this.aerolineaService.findAirportsFromAirline(aerolineaId);
    }

    @Get(':aerolineaId/airports/:aeropuertoId')
    async findAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return this.aerolineaService.findAirportFromAirline(aerolineaId, aeropuertoId);
    }

    @Put(':aerolineaId/airports')
    async updateAirportsFromAirline(@Param('aerolineaId') aerolineaId: string, @Body() aeropuertosIds: string[]) {
        return this.aerolineaService.updateAirportsFromAirline(aerolineaId, aeropuertosIds);
    }

    @Delete(':aerolineaId/airports/:aeropuertoId')
    async deleteAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return this.aerolineaService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
    }
}