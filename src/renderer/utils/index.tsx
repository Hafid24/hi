import {
    Input,
  } from '@chakra-ui/react';

  import SearchInput from '../components/SearchInput';
export const selectInput = (index: number, onChange: any,  type='main') => {
    switch (index) {
      case 0:
        return <Input size="md" type="datetime-local" onChange={onChange} />;
        break;
      case 1:
        return (
          <SearchInput
            placeholder={'0000 DA'}
            type="amount"
            onChange={onChange}
          />
        );

      case 2:
        return (
          <SearchInput
            placeholder={'Cherecher nom/prenom...'}
            onChange={onChange}
            type={''}
          />
        );

      case 3:
        return (
          <SearchInput placeholder="ID sociale" onChange={onChange} type={''} />
        );
        break;
      default:
        return (
          <SearchInput
            placeholder="ID Catre National"
            onChange={onChange}
            type={''}
          />
        );
        break;
    }
  };