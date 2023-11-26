import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TrackEntity } from '../track/track.entity';
import { PerformerEntity } from '../performer/performer.entity';

describe('albumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let trackRepository: Repository<TrackEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let albumList: AlbumEntity[];
  let deleteSpy: { calledWithId: string | null };  


  it('findall deberia retornar todos los albums', async () => {
    const result = await service.findall();
    expect(result).toEqual(albumList);
  });

  it('findOne deberia retornar el album con el id dado', async () => {
    const album = albumList[0];
    const result = await service.findOne(album.id);
    expect(result).toEqual(album);
  });

  it('findOne deberia tirar un NotFoundException si el album no se encuentra', async () => {
    const fakeAlbumId = faker.datatype.uuid();
    await expect(service.findOne(fakeAlbumId)).rejects.toThrow(NotFoundException);
  });

  it('se deberia crear el album correctamente', async () => {
    const newAlbum = {
      nombre: faker.name.findName(),
      caratula: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      fechaDeLanzamiento: faker.date.past(),
      performers: [],
      tracks: [],
    };

    const savedAlbum = await service.create(newAlbum);
    expect(savedAlbum).toBeDefined();
    expect(savedAlbum.id).toBeDefined();
    expect(savedAlbum.nombre).toEqual(newAlbum.nombre);
    expect(savedAlbum.descripcion).toEqual(newAlbum.descripcion);
  });

  it('deberia mostrar una excepción cuando se cree con la descripcion vacia', async () => {
    const newAlbum = {
      nombre: faker.name.findName(),
      caratula: faker.image.imageUrl(),
      descripcion: '',
      fechaDeLanzamiento: faker.date.past(),
      performers: [],
      tracks: [],
    };

    await expect(service.create(newAlbum)).rejects.toThrow(BadRequestException);
  });

  it('Se deberia eliminar un album', async () => {
    const album: AlbumEntity =  albumList[0];
    await service.delete(album.id);
  
    const deletedAlbum: AlbumEntity = await repository.findOne({ where: { id: album.id } })
    expect(deletedAlbum).toBeNull();
  });
  

  it('deberia mostra una excepcion cuando el album no tiene ese id', async () => {
    const album = albumList[0];
    await service.delete(album.id);
      await expect(service.delete("0")).rejects.toThrow(NotFoundException);
  });

  it('delete deberia mostrar una exepción si el album tiene tracks asociadas', async () => {
    const albumWithTracks = { ...albumList[0], tracks: [new TrackEntity()] };
    repository.findOne = jest.fn().mockResolvedValue(albumWithTracks);
    await expect(service.delete(albumWithTracks.id)).rejects.toThrow(BadRequestException);
  });

  it('addPerformerToAlbum deberia añadir un perfomer al album', async () => {
    const album = albumList[0];
    const performer = new PerformerEntity();
    performer.id = faker.datatype.uuid();
  
    repository.findOne = jest.fn().mockResolvedValue(album);
    performer.findOne = jest.fn().mockResolvedValue(performer);
  
    const result = await service.addPerformerToAlbum(album.id, performer.id);
  
    expect(result.performers).toContainEqual(performer);
  });

  it('addPerformerToAlbum no deberia permitir mas de tres performers en un album', async () => {
    const album = { ...albumList[0] };

    const updatedPerformers = Array.from({ length: 3 }, () => {
      const performer = new PerformerEntity();
      performer.id = faker.datatype.uuid();
      return performer;
    });

    const newPerformer = new PerformerEntity();
    newPerformer.id = faker.datatype.uuid();

    repository.findOne = jest.fn().mockResolvedValue(album);
    performerRepository.findOne = jest.fn().mockResolvedValue(newPerformer);

    await expect(service.addPerformerToAlbum(album.id, newPerformer.id)).rejects.toThrow(BadRequestException);
});

});