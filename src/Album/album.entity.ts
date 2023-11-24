import { TrackEntity } from '../Track/track.entity';
import { PerformerEntity } from '../Performer/Performer.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';


@Entity()
export class AlbumEntity{
   
    @PrimaryGeneratedColum('uuid')
    id: string;
    
    @Column()
    nombre: string;

    @Column()
    caratula: string;

    @Column()
    fechaDeLanzamiento: Date;

    @Column()
    descripcion: string;


    @OneToMany(type => TrackEntity, track => track.albums)
    @JoinTable()
    tracks: TrackEntity[];

    @ManyToMany(type => PerformerEntity, performer => performer.albums)
    @JoinTable()
    performers: PerformerEntity[];

}