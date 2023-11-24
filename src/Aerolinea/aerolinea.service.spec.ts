import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
"Pruebas de logica"
describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineaList: AerolineaEntity[];
  let deleteSpy: { calledWithId: string | null };

  beforeEach(async () => {
    // Crear un aeropuerto de prueba
    const aeropuertoTest = new AeropuertoEntity();
    aeropuertoTest.id = faker.datatype.uuid();
    aeropuertoTest.nombre = faker.address.cityName();
    aeropuertoTest.codigo = faker.random.alpha({ count: 3 }).toUpperCase();
    aeropuertoTest.pais = faker.address.country();
    aeropuertoTest.ciudad = faker.address.city();
  
    aerolineaList = Array.from({ length: 5 }).map(() => ({
      id: faker.datatype.uuid(),
      nombre: faker.company.companyName(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [aeropuertoTest], // Incluye el aeropuerto de prueba
    }));

    deleteSpy = { calledWithId: null };

    const mockAerolineaRepository = {
      find: jest.fn().mockResolvedValue(aerolineaList),
      findOne: jest.fn().mockImplementation((options) => {
        const id = options.where.id;
        return Promise.resolve(aerolineaList.find(a => a.id === id));
      }),
      save: jest.fn().mockImplementation((aero) => Promise.resolve({ id: faker.datatype.uuid(), ...aero })),
      delete: jest.fn().mockImplementation((id: string) => {
        deleteSpy.calledWithId = id;
        return Promise.resolve({ affected: 1 });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        AerolineaService,
        {
          provide: getRepositoryToken(AerolineaEntity),
          useValue: mockAerolineaRepository,
        },
      ],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas', async () => {
    const result = await service.findAll();
    expect(result).toEqual(aerolineaList);
  });

  it('findOne should return an aerolinea by ID', async () => {
    const aerolinea = aerolineaList[0];
    const result = await service.findOne(aerolinea.id);
    expect(result).toEqual(aerolinea);
  });

  it('create should fail if the fundation date is in the future', async () => {
    const newAerolinea = {
      ...aerolineaList[0],
      fechaFundacion: new Date(new Date().getTime() + 86400000), // Fecha en el futuro
    };
    try {
      await service.create(newAerolinea as AerolineaEntity);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('create should succeed with a past fundation date', async () => {
    const newAerolinea = {
      ...aerolineaList[0],
      fechaFundacion: new Date(new Date().getTime() - 86400000), // Fecha en el pasado
    };
    const result = await service.create(newAerolinea as AerolineaEntity);
    expect(result).toEqual(newAerolinea);
  });

  it('update should fail if the aerolinea is not found', async () => {
    try {
      await service.update(faker.datatype.uuid(), {});
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('update should fail if the fundation date is in the future', async () => {
    const aerolineaToUpdate = {
      ...aerolineaList[0],
      fechaFundacion: new Date(new Date().getTime() + 86400000), // Fecha en el futuro
    };
    try {
      await service.update(aerolineaList[0].id, aerolineaToUpdate as Partial<AerolineaEntity>);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('delete should remove an aerolinea', async () => {
    const aerolineaIdToDelete = aerolineaList[0].id;
    await service.delete(aerolineaIdToDelete);
    expect(deleteSpy.calledWithId).toEqual(aerolineaIdToDelete);
  });

  it('addAirportToAirline should add an airport to an airline', async () => {
    const aerolinea = aerolineaList[0];
    const aeropuerto = new AeropuertoEntity();
    aeropuerto.id = faker.datatype.uuid();
  
    jest.spyOn(aeropuertoRepository, 'findOne').mockResolvedValueOnce(aeropuerto);
    const result = await service.addAirportToAirline(aerolinea.id, aeropuerto.id);
  
    expect(result.aeropuertos).toContain(aeropuerto);
  });

  it('deleteAirportFromAirline should remove an airport from an airline', async () => {
    const aerolinea = aerolineaList[0];
    const aeropuerto = aerolinea.aeropuertos[0];
  
    const result = await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);
  
    expect(result.aeropuertos).not.toContain(aeropuerto);
  });  
  
});