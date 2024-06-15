import { useEffect, useState } from 'react';
import './table.css';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { columns } from './columns';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

import {selectInput} from '../../utils'

export default function Table({ _data, toggleModal, addClient }: any) {
  const [data, setData] = useState(() => [..._data]);
  const [originalData, setOriginalData] = useState(() => [..._data]);
  const [editedRows, setEditedRows] = useState({});
  useEffect(() => {
    if (_data) {
      setData(_data);
      setOriginalData(_data);
    }
  }, [_data]);

  const onChange = (e: any) => {
    console.log(e.target.value);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row,
            ),
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) =>
              index === rowIndex ? data[rowIndex] : row,
            ),
          );
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old: any) =>
          old.map((row: any, index: number) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      addCredit: (id: number, value: number) => {
        console.log(id, value);
        setData((old: any) =>
          old.map((row: any, index: number) => {
            if (row.id == id) {
              return {
                ...old[index],
                total_amount: value + old[index].total_amount,
              };
            }
            return row;
          }),
        );
      },
    },
  });

  return (
    <article className="table-container">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id + '_'}
              className='"lkjhkh'
              style={{ backgroundColor: 'white', color: 'black' }}
            >
              {headerGroup.headers.map((header, index) => (
                <th key={header.id}>{selectInput(index, onChange)}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <pre>{JSON.stringify(data, null, "\t")}</pre> */}

      <div style={{ display: 'flex', marginLeft: 'auto' }}>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <ArrowLeftIcon
            marginLeft="30px"
            marginRight="30px"
            cursor={!table.getCanNextPage() ? 'not-allowed' : 'pointer'}
            color={!table.getCanNextPage() ? 'gray' : 'black'}
          />{' '}
        </button>
        <h1> {'page   ' + table.options.state.pagination?.pageIndex}</h1>

        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowRightIcon
            marginLeft="30px"
            cursor={!table.getCanPreviousPage() ? 'not-allowed' : 'pointer'}
            color={!table.getCanPreviousPage() ? 'gray' : 'black'}
          />
        </button>
      </div>
    </article>
  );
}
