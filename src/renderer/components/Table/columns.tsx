import { createColumnHelper } from '@tanstack/react-table';
import { TableCell } from './TableCell';

import { EditCell } from './EditCell';

const columnHelper = createColumnHelper<any>();

export const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('name', {
    header: 'Nom/Prenom',
    cell: TableCell,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('total_amount', {
    header: 'Credit total',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('social_number', {
    header: 'No social',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('card_number', {
    header: 'No carte national',
    cell: TableCell,
    meta: {
      type: 'number',
    },
  }),

  columnHelper.display({
    id: 'edit',
    cell: EditCell,
  }),
  ];
