import bcrypt from 'bcrypt';
import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';

import { Condition } from '../../conditions/entities/conditions.entity';
import { Measurement } from '../../measurements/entities/measurements.entity';
import { IUser } from '../interfaces/user.interface';

@Entity('users')
export class User implements IUser {

    @Column({ type: 'varchar', primary: true, length: 36, default: () => 'uuid_generate_v4()' })
    public id!: string;

    @Column()
    public name!: string;

    @Column({ unique: true })
    public email!: string;

    @Column({ select: false })
    public password!: string;

    @OneToMany(() => Condition, (condition: Condition) => condition.user)
    public conditions!: Condition[];

    @OneToMany(() => Measurement, (measurement: Measurement) => measurement.user)
    public measurements!: Measurement[];

    @Column({ type: 'timestamptz', nullable: true })
    public confirmedAt!: Date | null;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    public deletedAt!: Date | null;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(providedPassword: string) {
        return bcrypt.compare(providedPassword, this.password);
    }
}
