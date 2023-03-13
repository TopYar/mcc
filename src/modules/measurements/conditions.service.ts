import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresError } from 'pg-error-enum';
import { QueryFailedError } from 'typeorm';

import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { ConditionsRepository, IUserGetByEmail, IUserGetOne, IUserUpdate } from './conditions.repository';


@Injectable()
export class ConditionsService {
    constructor(
        // @InjectRepository(ConditionsRepository)
        // private readonly usersRepository: ConditionsRepository,
    ) {}
}

interface IUpdateUserParams extends IUserUpdate {
    id: string;
}