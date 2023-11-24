import { AlbumEntity } from '../Album/album.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';


"2. se crea el entity de aeropuerto. "
"3. se genera el import de la clase creada acorde al enunciado"
"4. se crea la clase aeropuerto.service.ts la cual es la logica de aerolinea"
@Entity()
export class TrackEntity{
   "se usan los parametros dados por el enunciado en este caso nombre, codigo, pais, ciudad."
    @PrimaryGeneratedColum('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    duracion: number;

        //ManyToMany con AerolineaEntity
        @ManyToOne(type => AlbumEntity, album => album.albums)
        @JoinTable()
        albums: AlbumEntity[];

}