import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumDto } from './album.dto';
import { Response } from 'express';

@Controller('albums')
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    @Get()
    async findAll() {
        return this.albumService.findall();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.albumService.findOne(id);
    }

    @Post()
    async create(@Body() albumDto: AlbumDto) {
        return this.albumService.create(albumDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.albumService.delete(id);
    }
}