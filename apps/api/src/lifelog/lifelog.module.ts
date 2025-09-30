import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LifelogController } from './lifelog.controller'
import { LifelogService } from './lifelog.service'
import { LocationLog, PhotoMemory, PhotoTag } from '../database/entities'

@Module({
  imports: [TypeOrmModule.forFeature([LocationLog, PhotoMemory, PhotoTag])],
  controllers: [LifelogController],
  providers: [LifelogService],
  exports: [LifelogService],
})
export class LifelogModule {}
