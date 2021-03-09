interface FormValues {
    [key: string]: any;
}

interface Exhibition {
    id: string;
    exhibition_name: string;
}

interface YupConfig {
    [x: string]: yup.AnySchema;
}

interface ExhibitionValues {
    exhibition: Exhibition;
    columns: Array<CircleInputFieldConfig>;
    validator: YupConfig;
}