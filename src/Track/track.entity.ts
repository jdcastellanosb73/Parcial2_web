import { AlbumEntity } from '../album/album.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany,ManyToOne, JoinTable} from 'typeorm';


@Entity()
export class TrackEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    duracion: number;

    @ManyToOne(type => AlbumEntity, album => album.tracks)
    album: AlbumEntity;

}