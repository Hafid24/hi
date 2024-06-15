import { useEffect, useState } from 'react';
import styles from './Input.module.css';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export type Input = {
  onChange: (field: any) => void;
  type: string;
  placeholder?: string;
};
export default function Modal({ placeholder, type, onChange }: Input) {
  const [title, setTitle] = useState('');

  const [value, setValue] = useState('');

  const handleChange = (e: any) => {
    e.preventDefault();
    setValue(e.target.value);
    onChange(e);
  };
  const selectInput = (type: string) => {
    switch (type) {
      case 'datetime-local':
        return (
          <Input
            placeholder={placeholder ? placeholder : 'Cherecher ...'}
            size="md"
            type={type}
            onChange={handleChange}
          />
        );
        break;
      case 'amount':
        return (
          <InputGroup>
            <Input
              placeholder={placeholder ? placeholder : 'Cherecher ...'}
              value={value}
              onChange={handleChange}
            />
            <InputRightElement>
              <DeleteIcon
                color="green.500"
                onClick={() => setValue('')}
                cursor="pointer"
              />
            </InputRightElement>
          </InputGroup>
        );

      case 'name':
        return (
          <InputGroup>
            <Input
              placeholder={
                placeholder ? placeholder : 'Cherecher nom/prenom...'
              }
              value={value}
              onChange={handleChange}
            />
            <InputRightElement>
              <DeleteIcon color="green.500" onClick={() => setValue('')} />
            </InputRightElement>
          </InputGroup>
        );

      default:
        return (
          <InputGroup>
            <Input
              placeholder={placeholder ? placeholder : 'Cherecher ...'}
              value={value}
              onChange={handleChange}
            />
            <InputRightElement>
              <DeleteIcon color="green.500" onClick={() => setValue('')} />
            </InputRightElement>
          </InputGroup>
        );
        break;
    }
  };
  return <>{selectInput(type)}</>;
}
