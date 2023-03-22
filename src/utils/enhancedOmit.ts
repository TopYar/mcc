type RemoveIndex<T> = {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K]
};
export type EnhancedOmit<T, K extends string | number | symbol> = Omit<RemoveIndex<T>, K>;