import { GeneratedPropsTypes } from '../../theme/Types';
import { Icon, IconButton } from '../../theme/components';
import { fonts } from '../../theme';
import { generateProps } from 'styled-gen';
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

type SearchInputProps = GeneratedPropsTypes & {
    defaultValue?: string | string[];
    onChange: Function;
    placeholder?: string;
};

const Input = styled.input`
    border: 0;
    font-family: ${fonts.families.inter};
    height: 2rem;
    line-height: 2rem;
    outline: 0;
    padding-right: 0.5rem;
    width: 100%;
`;

const InputWrapper = styled.div<GeneratedPropsTypes>`
    align-items: center;
    display: flex;
    width: 100%;

    ${generateProps};
`;

export const SearchInput = (props: SearchInputProps) => {
    const { defaultValue, onChange, placeholder, ...forwardProps } = props;
    const [inputValue, setInputValue] = useState(defaultValue);

    useEffect(() => {
        setInputValue(defaultValue);
    }, [defaultValue]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event?.target?.value;

        setInputValue(value);
        onChange(value);
    };

    const handleClear = () => {
        setInputValue('');
        onChange('');
    };

    return (
        <InputWrapper {...forwardProps}>
            <Icon icon="magnifier" mr={0.75} sHeight={1} />
            <Input onChange={handleChange} placeholder={placeholder} value={inputValue || ''} />
            {!!inputValue && <IconButton icon="close" onClick={handleClear} round />}
        </InputWrapper>
    );
};