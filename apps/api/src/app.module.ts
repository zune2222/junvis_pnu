import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { LifelogModule } from './lifelog/lifelog.module';
import { TransportModule } from './transport/transport.module';
import { PnuModule } from './pnu/pnu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    LifelogModule,
    TransportModule,
    PnuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
