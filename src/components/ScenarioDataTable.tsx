import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { fullSize } from '../styles';
import { Link } from '@mui/material';
import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import { AppModel, useAppModel } from '../models/AppModel';
import { Link as RouterLink } from 'react-router-dom';
import { Scenario } from '../models/DataModel';

export interface ScenarioDataTableViewModelProps {
  appModel: AppModel;
}

export class ScenarioDataTableViewModel extends BaseViewModel<ScenarioDataTableViewModelProps> {
  constructor(props: ScenarioDataTableViewModelProps) {
    super(props);
    makeSimpleAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this.props.appModel.dataModel.scenarios;
  }
}

export const ScenarioDataTable = observer(() => {
  const appModel = useAppModel();

  const viewModel = useViewModelConstructor(ScenarioDataTableViewModel, {
    appModel,
  });

  const columns = useMemo<MRT_ColumnDef<Scenario>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableHiding: false,
        size: 240,
        Cell: ({ cell }) => (
          <Link component={RouterLink} to={`/scenario/${cell.getValue<string>()}`}>
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
    getRowId: (row) => row.scenarioText,
    columns,
    data: viewModel.data,
    enableBottomToolbar: false,

    // enableGlobalFilter: false,

    enableColumnResizing: true,
    // enableRowSelection: true,
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

    initialState: {
      sorting: [{ id: 'ranking', desc: false }],
      columnVisibility: {
        startDate: false,
      },
    },
  });

  return <MaterialReactTable css={fullSize} table={table} />;
});
