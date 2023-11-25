import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { PerformerModule } from '../performer/performer.module';
import { TrackModule} from '../track/track.module';
import { AlbumController } from './album.controller';
//TODO: revisar

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity]),
    forwardRef(() => PerformerModule),
    forwardRef(() => TrackModule),
  ],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [TypeOrmModule.forFeature([AlbumEntity]), AlbumService]
})
export class AlbumModule {}