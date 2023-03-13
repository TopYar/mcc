import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeasurementPreset } from './entities/measurement-presets.entity';
import { MeasurementValue } from './entities/measurement-values.entity';
import { Measurement } from './entities/measurements.entity';
import { MeasurementPresetsRepository } from './measurement-presets.repository';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsRepository } from './measurements.repository';
import { MeasurementsService } from './measurements.service';

@Module({
    imports: [TypeOrmModule.forFeature([Measurement, MeasurementPreset, MeasurementValue])],
    controllers: [MeasurementsController],
    providers: [MeasurementsService, MeasurementsRepository, MeasurementPresetsRepository],
    exports: [MeasurementsService],
})
export class MeasurementsModule {}
