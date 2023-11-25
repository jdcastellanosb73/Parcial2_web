import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AlbumService } from './album.service';

@Controller('albums')
export class AlbumPerformerController {
    constructor(private albumService: AlbumService) {}

    @Post(':albumId/performers/:performerId')
    async addPerformerToAlbum(@Param('albumId') albumId: string, @Param('performerId') performerId: string) {
        return this.albumService.addPerformerToAlbum(albumId, performerId);
    }
}