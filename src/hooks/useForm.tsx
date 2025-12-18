import { useState } from 'react';

export const useForm = (initialState: any) => {
    const [state, setState] = useState(initialState);

    const onChangeGeneral = (event: any, field: any) => {
        if (event?.target) {
            const { type, checked, value } = event.target;

            const newValue = type === "checkbox" ? checked : value;
            setState({
                ...state,
                [field]: newValue
            });
            return;
        }

        setState({
            ...state,
            [field]: event
        });
    }

    const resetForm = () => {
        setState(initialState);
    }


    return {
        ...state,
        form: state,
        onChangeGeneral,
        resetForm,
        setState
    }
}
