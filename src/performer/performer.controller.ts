import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PerformerService } from './performer.service';
import { PerformerDto } from './performer.dto';

@Controller('performers')
export class PerformerController {
    constructor(private performerService: PerformerService) {}

    @Get()
    async findAll() {
        return this.performerService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.performerService.findOne(id);
    }

    @Post()
    async create(@Body() performerDto: PerformerDto) {
        return this.performerService.create(performerDto);
    }
}