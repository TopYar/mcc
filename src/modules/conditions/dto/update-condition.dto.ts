export interface UpdateConditionDto {
    id: string;
    name?: string;
    measurements?: {
        tracking?: string[];
        presets?: string[];
    };
}
