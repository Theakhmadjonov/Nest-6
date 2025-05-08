import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseMOdule } from "./database/databse.module";

@Module({
    imports: [
        DatabaseMOdule,
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
          }),
          JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: {
                expiresIn: '1h',
              },
              inject: [ConfigService],
            }),
          }),
    ],
})
export class CoreMOdule{ }
