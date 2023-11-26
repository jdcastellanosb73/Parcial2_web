import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AlbumEntity } from '../album/album.entity';

describe('PerformerService', () => {
    let service: PerformerService;
    let performerRepository: Repository<PerformerEntity>;
    let albumRepository: Repository<AlbumEntity>;
    let performerList: PerformerEntity[];
    let deleteSpy: { calledWithId: string | null };


    beforeEach(async () => {
        performerList = Array.from({ length: 5 }).map(() => ({
        id: faker.string.uuid(),
        nombre: faker.name.firstName(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentence(),
        albums: [],
      }));
  
      deleteSpy = { calledWithId: null };
  
      const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [
          PerformerService,
          {
            provide: getRepositoryToken(PerformerEntity),
            useValue: {
              find: jest.fn().mockResolvedValue(performerList),
              findOne: jest.fn().mockImplementation((options) => {
                const id = options.where.id;
                return Promise.resolve(performerList.find(a => a.id === id));
              }),
              save: jest.fn().mockImplementation((aero) => Promise.resolve({ id: faker.datatype.uuid(), ...aero })),
              delete: jest.fn().mockImplementation((id: string) => {
                deleteSpy.calledWithId = id;
                return Promise.resolve({ affected: 1 });
              }),
            },
          },
        ],
      }).compile();

      service = module.get<PerformerService>(PerformerService);
      performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
      albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    });
  
    it('findAll deberia retornar todos los performers', async () => {
      const result = await service.findAll();
      expect(result).toEqual(performerList);
    });
  
    it('findOne deberia retornar un performer con el id dado', async () => {
      const performer = performerList[0];
      const result = await service.findOne(performer.id);
      expect(result).toEqual(performer);
    });
  
    it('findOne deberia mostrar una excepción si no se encuentra el performer con el id dado', async () => {
      performerRepository.findOne = jest.fn().mockResolvedValue(null);
      const fakePerformerId = faker.datatype.uuid();
      await expect(service.findOne(fakePerformerId)).rejects.toThrow(NotFoundException);
    });
  
    it('create deberia crear un performer', async () => {
      const performerDto = {
        nombre: faker.name.firstName(),
        imagen: faker.image.url(),
        descripcion: 'ssss', 
      };
    
      const result = await service.create(performerDto);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.nombre).toEqual(performerDto.nombre);
      expect(result.descripcion).toEqual(performerDto.descripcion);
    });
  
    it('create deberia mostar un error si la descripcion tiene mas de 100 caracteres', async () => {
      const performerDto = {
        nombre: faker.name.firstName(),
        imagen: faker.image.url(),
        descripcion: 'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
        albumes: [], // se tienen 103 's'
      };
  
      await expect(service.create(performerDto)).rejects.toThrow(BadRequestException);
    });
    
  });