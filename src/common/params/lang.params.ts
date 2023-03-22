import { enumToArray } from '../../utils/enumToArray';
import { Enum } from '../../utils/validator';
import { ELang } from '../helpers/lang';

export class LangParams {
    @Enum({ values: enumToArray(ELang), optional: true })
    lang?: ELang;
}