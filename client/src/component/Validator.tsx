import * as yup from "yup";

const createValidator = (columns: Array<CircleInputFieldConfig>) => {
    const config: { [x: string]: yup.AnySchema } = {};

    for (const r of columns) {
        const name = r.column_name;
        const constraints = r.constraints || [];
        let v = yup.string();

        for (const c of constraints) {
            if (!c.length) {
                continue;
            }

            const type = c.shift();

            switch (type) {
                case 'katakana':
                    v = v.matches(/^[ァ-ンヴー]*$/, { message: "カナで入力してください" });
                    break;

                case 'url':
                    v = v.url();
                    break;

                case 'number':
                    v = v.matches(/^\d+$/, { message: "正の数値で入力してください" });
                    break;
            }

            config[name] = v;
        }
    }

    return yup.object().shape(config);
}

export default createValidator;