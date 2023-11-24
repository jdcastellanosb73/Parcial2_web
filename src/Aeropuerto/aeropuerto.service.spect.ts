import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
"Pruebas de logica"
describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoList: AeropuertoEntity[];
  let deleteSpy: { calledWithId: string | null };

  beforeEach(async () => {
    aeropuertoList = Array.from({ length: 5 }).map(() => ({
      id: faker.datatype.uuid(),
      nombre: faker.address.cityName(),
      codigo: faker.random.alpha({ count: 3 }).toUpperCase(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: [],
    }));

    deleteSpy = { calledWithId: null };

    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        AeropuertoService,
        {
          provide: getRepositoryToken(AeropuertoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(aeropuertoList),
            findOne: jest.fn().mockImplementation((options) => {
              const id = options.where.id;
              return Promise.resolve(aeropuertoList.find(a => a.id === id));
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

    service = module.get<AeropuertoService>(AeropuertoService);
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const result = await service.findAll();
    expect(result).toEqual(aeropuertoList);
  });

  it('findOne should return an airport by ID', async () => {
    const aeropuerto = aeropuertoList[0];
    const result = await service.findOne(aeropuerto.id);
    expect(result).toEqual(aeropuerto);
  });

  it('create should fail if the airport code has more than 3 characters', async () => {
    try {
      await service.create({
        ...aeropuertoList[0], codigo: 'ABCD',
        latitud: 0,
        longitud: 0
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('create should succeed with a 3-character airport code', async () => {
    const newAeropuerto = {
      ...aeropuertoList[0],
      id: faker.datatype.uuid(),
      latitud: faker.datatype.number({ min: -90, max: 90 }),
      longitud: faker.datatype.number({ min: -180, max: 180 })
    };
    const result = await service.create(newAeropuerto);
    expect(result).toEqual(newAeropuerto);
  });
  

  it('update should fail if the airport code has more than 3 characters', async () => {
    try {
      await service.update(aeropuertoList[0].id, { codigo: 'ABCD' });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('update should succeed with a 3-character airport code', async () => {
    const updatedAeropuerto = { ...aeropuertoList[0], codigo: 'ABC' };
    const result = await service.update(aeropuertoList[0].id, updatedAeropuerto);
    expect(result.codigo).toEqual('ABC');
  });

  it('delete should remove an airport', async () => {
    const aeropuertoIdToDelete = aeropuertoList[0].id;
    await service.delete(aeropuertoIdToDelete);

    expect(deleteSpy.calledWithId).toEqual(aeropuertoIdToDelete);
  });

  it('findAirportFromAirline should return an airport from an airline', async () => {
    const aerolinea = new AerolineaEntity();
    aerolinea.id = faker.datatype.uuid();
    const aeropuerto = new AeropuertoEntity();
    aeropuerto.id = faker.datatype.uuid();
    aerolinea.aeropuertos = [aeropuerto];
  
    jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValueOnce(aerolinea);
    const result = await service.findAirportFromAirline(aerolinea.id, aeropuerto.id);
  
    expect(result).toEqual(aeropuerto);
  });
  
  
});