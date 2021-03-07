interface FormValues {
    [key: string]: any;
}

interface Exhibition {
    id: string;
    exhibition_name: string;
}

interface ExhibitionValues {
    exhibition: Exhibition;
    columns: Array<CircleInputFieldConfig>;
}