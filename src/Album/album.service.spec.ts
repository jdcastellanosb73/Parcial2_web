import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { TrackEntity } from '../track/track.entity';
import { PerfomerEntity } from '../perfomer/perfomer.entity';

describe('albumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let trackRepository: Repository<TrackEntity>;
  let perfomerRepository: Repository<PerfomerEntity>;
  let aerolineaList: AlbumEntity[];
  let deleteSpy: { calledWithId: string | null };

  it('create should fail if with a description', async () => {
    const newAlbum = {
      ...albumList[0],
      descripcion: "sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"
    };
    try {
      await service.create(newAlbum as AlbumEntity);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('create should succeed with a description', async () => {
    const newAlbum = {
      ...albumList[0],
      descripcion: "Hola", 
    };
    const result = await service.create(newAlbum as AlbumEntity);
    expect(result).toEqual(newAlbum);
  });
});