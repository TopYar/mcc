export interface CreateConditionDto {
    name?: string;
    conditionPresetId?: string;
    measurements?: {
        tracking?: string[];
        presets?: string[];
    };
}
