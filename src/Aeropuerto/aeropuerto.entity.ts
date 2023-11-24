import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';


"2. se crea el entity de aeropuerto. "
"3. se genera el import de la clase creada acorde al enunciado"
"4. se crea la clase aeropuerto.service.ts la cual es la logica de aerolinea"
@Entity()
export class AeropuertoEntity{
   "se usan los parametros dados por el enunciado en este caso nombre, codigo, pais, ciudad."
    @PrimaryGeneratedColum('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    pais: string;

    @Column()
    ciudad: string;

        //ManyToMany con AerolineaEntity
        @ManyToMany(type => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
        @JoinTable()
        aerolineas: AerolineaEntity[];

}