import { TrackEntity } from '../Track/track.entity';
import { PerformerEntity } from '../performer/Performer.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany,OneToMany, JoinTable} from 'typeorm';


@Entity()
export class AlbumEntity{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    caratula: string;

    @Column()
    fechaDeLanzamiento: Date;

    @Column()
    descripcion: string;



    @OneToMany(type => TrackEntity, track => track.album)
    @JoinTable()
    tracks: TrackEntity[];

    @ManyToMany(type => PerformerEntity, performer => performer.albums)
    @JoinTable()
    performers: PerformerEntity[];

}