interface CircleInputFieldConfig {
    column_name: string;
    type: string;
    constraints: Array;
    label: string;
    description: string;
    required?: boolean;
    values: FormValues;
    validator: (value: string) => boolean,
}