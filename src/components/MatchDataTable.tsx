import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { fullSize } from '../styles';
import { Link } from '@mui/material';
import { Match } from '../types';
import { Link as RouterLink } from 'react-router-dom';

export interface MatchDataTableProps {
  matches: Match[];
  playerName: string;
}

export interface FixedMatch<T extends string> {
  p1: T;
  p2: string;
  winner: boolean;
  date: number;
}

export const MatchDataTable = observer((props: MatchDataTableProps) => {
  const { matches, playerName } = props;

  const data = useMemo(() => {
    return matches
      .filter((match) => match.p1 === playerName || match.p2 === playerName)
      .map((match) => {
        const winnerName = match[match.winner];

        return {
          p1: playerName,
          p2: match.p1 === playerName ? match.p2 : match.p1,
          winner: winnerName === playerName,
          date: match.date,
        };
      });
  }, [matches, playerName]);

  const columns = useMemo<MRT_ColumnDef<FixedMatch<string>>[]>(
    () => [
      {
        accessorKey: 'p1',
        header: 'Player 1',
        enableHiding: false,
        size: 240,
        Cell: ({ cell }) => (
          <Link component={RouterLink} to={`/player/${cell.getValue<string>()}`}>
            {cell.getValue<string>()}
          </Link>
        ),
      },
      {
        accessorKey: 'p2',
        header: 'Player 2',
        enableHiding: false,
        size: 240,
        Cell: ({ cell }) => (
          <Link component={RouterLink} to={`/player/${cell.getValue<string>()}`}>
            {cell.getValue<string>()}
          </Link>
        ),
      },
      {
        accessorKey: 'winner',
        header: 'Result',
        enableHiding: false,
        size: 240,
        Cell: ({ cell }) => (
          <span
            css={{
              color: cell.getValue<boolean>() ? 'green' : 'red',
            }}
          >
            {cell.getValue<boolean>() ? 'Win' : 'Loss'}
          </span>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        Cell: ({ cell }) => new Date(cell.getValue<number>()).toLocaleDateString(), //custom cell renderer
        filterVariant: 'date-range',
        filterFn: 'betweenInclusive',
        size: 315,
        muiFilterDatePickerProps: {
          sx: {
            width: '72px !important',
            minWidth: '0 !important',
            backgroundColor: 'red',
          },
          className: 'mui-date-picker',
          format: 'MM/dd/yy',
        },
      },
    ],
    [],
  );

  //pass table options to useMaterialReactTable
  const table = useMaterialReactTable({
    columns,
    data,
    enableBottomToolbar: false,

    // enableGlobalFilter: false,

    enableColumnResizing: true,
    enableRowSelection: false,
    enableColumnOrdering: true,
    enableRowVirtualization: true,
    enablePagination: false,

    enableEditing: false,

    enableStickyHeader: true,

    muiTableContainerProps: { sx: { flex: 1 } },
    muiTablePaperProps: {
      sx: { maxHeight: '100%', display: 'flex', flexDirection: 'column' },
    },

    initialState: {
      sorting: [{ id: 'ranking', desc: false }],
      columnVisibility: {
        startDate: false,
      },
    },
  });

  return <MaterialReactTable css={fullSize} table={table} />;
});
