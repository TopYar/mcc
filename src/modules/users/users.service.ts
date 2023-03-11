import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresError } from 'pg-error-enum';
import { QueryFailedError } from 'typeorm';

import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { IUserGetByEmail, IUserGetOne, IUserUpdate, UsersRepository } from './users.repository';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {}
    async registerUser({ name, email, password }: CreateUserDto): Promise<TResult<User>> {
        let user = await SafeCall.call<typeof this.usersRepository.getByEmail>(
            this.usersRepository.getByEmail({ email }),
        );

        if (user instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_USER);
        }

        if (user) {
            if (!user.confirmedAt) {
                const updateResult = await SafeCall.call<typeof this.usersRepository.updateUser>(
                    this.usersRepository.updateUser(user, { name, password }),
                );

                if (updateResult instanceof Error) {
                    return ServiceResponse.fail(ServiceResponse.CODES.FAIL_UPDATE_USER);
                }
            } else {
                return ServiceResponse.fail(ServiceResponse.CODES.ERROR_USER_ALREADY_EXISTS);
            }
        } else {
            user = await SafeCall.call<typeof this.usersRepository.createUser>(
                this.usersRepository.createUser({ name, email, password }),
            );

            if (user instanceof Error) {
                if (user instanceof QueryFailedError) {
                    switch (user.driverError.code) {
                        case PostgresError.UNIQUE_VIOLATION:
                            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_USER_ALREADY_EXISTS);
                    }
                }

                return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_USER);
            }
        }

        return ServiceResponse.ok(user);
    }

    async getOne({ id, attributes }: IUserGetOne) {
        const user = await this.usersRepository.getOne({ id, attributes });

        if (!user) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_USER_NOT_FOUND);
        }

        return ServiceResponse.ok(user);
    }
    getByEmail({ email, attributes }: IUserGetByEmail) {
        return this.usersRepository.getByEmail({ email, attributes });
    }

    async updateUser({ id, name, password, confirmedAt }: IUpdateUserParams): Promise<TResult<User>> {
        const user = await SafeCall.call<typeof this.usersRepository.updateUser>(
            this.usersRepository.updateUser({ id }, { name, password, confirmedAt }),
        );

        if (user instanceof Error) {
            console.error(user);

            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_UPDATE_USER);
        }

        return ServiceResponse.ok(user);
    }
}

interface IUpdateUserParams extends IUserUpdate {
    id: string;
}