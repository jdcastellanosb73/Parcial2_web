import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackDto } from './track.dto';

@Controller('airports')
export class AeropuertoController {
    constructor(private TrackService: TrackService) {}

    @Get()
    async findAll() {
        return this.TrackService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.TrackService.findOne(id);
    }

    @Post()
    async create(@Body() TrackDto: TrackDto) {
        return this.TrackService.create(TrackDto);
    }
}