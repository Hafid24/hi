import e from 'express';
import { useState, useEffect, ChangeEvent } from 'react';
import './table.css';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';

import { PlusSquareIcon } from '@chakra-ui/icons';

type Option = {
  label: string;
  value: string;
};

export const AddCredit = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();

  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const addCredit = () => {
    tableMeta?.addCredit(row.id, value);
  };

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value);
  };
  return (
    <InputGroup>
      <Input
        value={value}
        onBlur={onBlur}
        type={columnMeta?.type || 'text'}
        onChange={(e) => setValue(e.target.value)}
      />
      <InputRightElement>
        <PlusSquareIcon color="green.500" onClick={() => addCredit()} />
      </InputRightElement>
    </InputGroup>
  );
};
