interface CircleInputFieldConfig {
    column_name: string;
    type: string;
    label: string;
    description: string;
    required?: boolean;
    values: FormValues;
    validator: (value: string) => boolean,
}