import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';

import { Measurement } from './measurements.entity';

@Entity('measurement_values')
export class MeasurementValue {
    @Column({ type: 'varchar', primary: true, length: 36, default: () => 'uuid_generate_v4()' })
    public id!: string;

    @Column({ type: 'decimal' })
    public value!: string;

    @ManyToOne(() => Measurement, (measurement: Measurement) => measurement.measurementValues, { nullable: false })
    public measurement!: Measurement;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    public deletedAt!: Date | null;
}
