export function enumToArray<T extends object>(enumObject: T): (keyof T)[] {
    return Object.keys(enumObject) as (keyof T)[];
}