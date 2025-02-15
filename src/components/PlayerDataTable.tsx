import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  MRT_Updater,
  useMaterialReactTable,
} from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { fullSize } from '../styles';
import { Link } from '@mui/material';
import { BaseViewModel } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import { AppModel } from '../models/AppModel';
import { toJS } from 'mobx';
import { Link as RouterLink } from 'react-router-dom';

export interface Player {
  name: string;
  wins: number;
  losses: number;
  rating: number;
  ranking: number;
  startDate: number;
}

export interface PlayerDataTableViewModelProps {
  appModel: AppModel;
}

export class PlayerDataTableViewModel extends BaseViewModel<PlayerDataTableViewModelProps> {
  constructor(props: PlayerDataTableViewModelProps) {
    super(props);
    makeSimpleAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this.props.appModel.playerData;
  }

  selectedPlayers: Set<string> = new Set();

  setSelectedPlayers(players: Set<string>) {
    this.selectedPlayers = players;
  }

  get rowSelection() {
    return Array.from(this.selectedPlayers).reduce(
      (acc, player) => ({ ...acc, [player]: true }),
      {},
    );
  }

  setRowSelection(updater: MRT_Updater<MRT_RowSelectionState>) {
    const values = typeof updater === 'function' ? updater(this.rowSelection) : updater;

    this.selectedPlayers = new Set(Object.keys(values).filter((key) => values[key]));

    console.log(toJS(this.selectedPlayers));
  }
}

export interface PlayerDataTableProps {
  viewModel: PlayerDataTableViewModel;
}

export const PlayerDataTable = observer((props: PlayerDataTableProps) => {
  const { viewModel } = props;

  const columns = useMemo<MRT_ColumnDef<Player>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableHiding: false,
        size: 240,
        Cell: ({ cell }) => (
          <Link component={RouterLink} to={`/player/${cell.getValue<string>()}`}>
            {cell.getValue<string>()}
          </Link>
        ),
      },
      {
        accessorKey: 'ranking',
        header: 'Rank',
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        size: 164,
        muiFilterTextFieldProps: {
          sx: { width: '72px !important', minWidth: '0 !important' },
        },
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive',

        size: 164,
        muiFilterSliderProps: {
          marks: true,
          step: 50,
        },
      },
      {
        accessorKey: 'wins',
        header: 'Wins',
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        size: 164,
        muiFilterTextFieldProps: {
          sx: { width: '72px !important', minWidth: '0 !important' },
        },
      },
      {
        accessorKey: 'losses',
        header: 'Losses',
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        size: 164,
        muiFilterTextFieldProps: {
          sx: { width: '72px !important', minWidth: '0 !important' },
        },
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
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

  const table = useMaterialReactTable({
    getRowId: (row) => row.name,
    columns,
    data: viewModel.data,
    enableBottomToolbar: false,

    // enableGlobalFilter: false,

    enableColumnResizing: true,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableRowVirtualization: true,
    enablePagination: false,
    enableFacetedValues: true,

    enableEditing: false,

    enableStickyHeader: true,

    muiTableContainerProps: { sx: { flex: 1 } },
    muiTablePaperProps: {
      sx: { maxHeight: '100%', display: 'flex', flexDirection: 'column' },
    },

    onRowSelectionChange: viewModel.setRowSelection,
    state: {
      rowSelection: viewModel.rowSelection,
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
