import { useState } from 'react';

export const useForm = (initialState: any) => {
    const [state, setState] = useState(initialState);

    const onChangeGeneral = (event: any, field: any) => {
        if (event?.target) {
            setState({
                ...state,
                [field]: event.target.value
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
