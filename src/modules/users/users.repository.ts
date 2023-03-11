import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { DataSource, ILike, Repository } from 'typeorm';

import { User } from './entities/user.entity';

export interface IUserCreate {
    name: string;
    email: string;
    password: string;
}
export interface IUserGetOne {
    id: string;

    attributes?: (keyof User)[];
}
export interface IUserGetByEmail {
    email: string;

    attributes?: (keyof User)[];
}

export interface IUserUpdate {
    name?: string;
    password?: string;

    confirmedAt?: Date;
}

@Injectable()
export class UsersRepository extends Repository<User> {

    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }
    async createUser({
        name,
        email,
        password,
    }: IUserCreate) {
        const user = this.create({ name, email: email.toLowerCase(), password });

        return this.save(user);
    }

    async getOne({ id, attributes }: IUserGetOne) {
        return this.findOne({ where: { id }, select: attributes });
    }
    async getByEmail({ email, attributes }: IUserGetByEmail) {
        return this.findOne({ where: { email: ILike(email) }, select: attributes });
    }

    async updateUser(user: { id: string; }, payload: IUserUpdate) {
        const args: { [k: string]: any; } = {};

        if (payload.name) {
            args.name = payload.name;
        }

        if (payload.password) {
            args.password = payload.password;
        }

        if (payload.confirmedAt) {
            args.confirmedAt = payload.confirmedAt;
        }


        if (!_.isEmpty(args)) {
            const userInstance = this.create({ id: user.id, ...args });
            const userResult = await this.createQueryBuilder()
                .update(User)
                .set(userInstance)
                .where({ id: user.id })
                .returning('*')
                .execute();

            if (userResult.raw.length) {
                Object.assign(user, userResult.raw[0]);
            }
        }
    }
}