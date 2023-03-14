import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConditionsModule } from '../conditions/conditions.module';
import { MeasurementPreset } from './entities/measurement-presets.entity';
import { MeasurementValue } from './entities/measurement-values.entity';
import { Measurement } from './entities/measurements.entity';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { MeasurementPresetsRepository } from './repositories/measurement-presets.repository';
import { MeasurementValuesRepository } from './repositories/measurement-values.repository';
import { MeasurementsRepository } from './repositories/measurements.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Measurement, MeasurementPreset, MeasurementValue]),
        forwardRef(() => ConditionsModule),
    ],
    controllers: [MeasurementsController],
    providers: [MeasurementsService, MeasurementsRepository, MeasurementPresetsRepository, MeasurementValuesRepository],
    exports: [MeasurementsService],
})
export class MeasurementsModule {}
