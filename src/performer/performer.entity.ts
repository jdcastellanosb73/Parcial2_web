import { AlbumEntity } from '../album/album.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';


@Entity()
export class PerformerEntity{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;


    @ManyToMany(type => AlbumEntity, album => album.performers)
    @JoinTable()
    albums: AlbumEntity[];
}