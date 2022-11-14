import React, { InputHTMLAttributes } from 'react';
import { Formik, Form, useField } from 'formik';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder;
};

const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  return (
    <>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
        <Input {...field} placeholder={props.placeholder} id={field.name} />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    </>
  );
};
export default InputField;
