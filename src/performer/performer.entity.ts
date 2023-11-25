import { AlbumEntity } from '../Album/album.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';


@Entity()
export class TrackEntity{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    //ManyToOne con AlbumEntity
    @ManyToMany(type => AlbumEntity, Album => Album.albums)
    @JoinTable()
    albums: AlbumEntity[];

}