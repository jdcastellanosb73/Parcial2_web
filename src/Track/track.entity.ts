import { AlbumEntity } from '../Album/album.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany,ManyToOne, JoinTable} from 'typeorm';


@Entity()
export class TrackEntity{
   "se usan los parametros dados por el enunciado en este caso nombre, codigo, pais, ciudad."
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    duracion: number;

    @ManyToOne(type => AlbumEntity, album => album.tracks)
    album: AlbumEntity;

}