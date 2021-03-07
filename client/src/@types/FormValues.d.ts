interface FormValues {
    [key: string]: any;
}

interface ExhibitionValues {
    exhibition?: { id: string; exhibition_name: string; }
    columns?: Array<CircleInputFieldConfig>;
    loaded?: boolean;
    error?: Error;
}