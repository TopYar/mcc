export interface MeasurementDto {
    id: string,
    name: string,
    unit: string,
    displayTime: boolean,
    values?: {
        id: string,
        value: string,
        createdAt: Date;
    }[];
}