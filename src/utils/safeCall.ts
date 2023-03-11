import { ExtendedAwaited } from './awaitedType';

export class SafeCall {
    static async call<H extends (...args: any) => any>(action: any) {
        return (await action.catch((e: any) => e)) as ExtendedAwaited<H>;
    }
}