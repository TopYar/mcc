import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConditionsModule } from '../conditions/conditions.module';
import { MeasurementPreset } from './entities/measurement-presets.entity';
import { MeasurementValue } from './entities/measurement-values.entity';
import { Measurement } from './entities/measurements.entity';
import { MeasurementPresetsRepository } from './measurement-presets.repository';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsRepository } from './measurements.repository';
import { MeasurementsService } from './measurements.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Measurement, MeasurementPreset, MeasurementValue]),
        forwardRef(() => ConditionsModule),
    ],
    controllers: [MeasurementsController],
    providers: [MeasurementsService, MeasurementsRepository, MeasurementPresetsRepository],
    exports: [MeasurementsService],
})
export class MeasurementsModule {}
