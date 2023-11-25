import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerService } from './performer.service';
import { PerformerEntity } from './performer.entity';
import { AlbumModule } from '../album/album.module';
import { PerformerController } from './performer.controller'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([PerformerEntity]),
    forwardRef(() => AlbumModule),
  ],
  providers: [PerformerService],
  controllers: [PerformerController],
  exports: [TypeOrmModule.forFeature([PerformerEntity]), PerformerService]
})
export class PerformerModule {}