import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';

"1. se crea la clase entity con sus parametros"
"3. se genera el import de la clase creada acorde al enunciado"
@Entity()
export class AerolineaEntity{
   "se usan los parametros dados por el enunciado en este caso nombre, descripcion, fecha y  pagina web."
    @PrimaryGeneratedColum('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    fechaFundacion: Date;

    @Column()
    paginaWeb: string;

    //ManyToMany con AeropuertoEntity
    @ManyToMany(type => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
    @JoinTable()
    aeropuertos: AeropuertoEntity[];

}