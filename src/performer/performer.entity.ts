import { AlbumEntity } from '../Album/album.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';


@Entity()
export class TrackEntity{
   
    @PrimaryGeneratedColum('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    //ManyToOne con TrackEntity
    @ManyToMany(type => AlbumEntity, Album => album.albums)
    @JoinTable()
    albums: AlbumEntity[];

}