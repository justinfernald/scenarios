import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { fullSize } from '../styles';
import { IconButton } from '@mui/material';
import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import { AppModel, useAppModel } from '../models/AppModel';
import { Link as RouterLink } from 'react-router-dom';
import { Scenario } from '../models/DataModel';
import { QueryStats } from '@mui/icons-material';
import { FlexRow } from './base/Flex';
import { DeleteButton } from './DeleteButton';
import { toJS } from 'mobx';

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

  get rankingMap() {
    return this.props.appModel.dataModel.rankingMap;
  }
}

export const ScenariosDataTable = observer(() => {
  const appModel = useAppModel();

  const viewModel = useViewModelConstructor(ScenarioDataTableViewModel, {
    appModel,
  });

  const columns = useMemo<MRT_ColumnDef<Scenario>[]>(
    () => [
      {
        accessorKey: 'scenarioText',
        header: 'Scenario',
        enableHiding: false,
        size: 340,
      },
      {
        id: 'rank',
        accessorFn: (row) => viewModel.rankingMap.get(row.id) ?? Infinity,
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

        Cell: ({ cell }) => cell.getValue<number>().toFixed(0),
      },
      {
        accessorKey: 'timesChosen',
        header: 'Wins',
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        size: 164,
        muiFilterTextFieldProps: {
          sx: { width: '72px !important', minWidth: '0 !important' },
        },
      },
      {
        accessorFn: (row) => row.timesShown - row.timesChosen,
        header: 'Losses',
        filterVariant: 'range',
        filterFn: 'betweenInclusive',
        size: 164,
        muiFilterTextFieldProps: {
          sx: { width: '72px !important', minWidth: '0 !important' },
        },
      },
      {
        id: 'userMade',
        accessorFn: (row) => row.createdBy === appModel.authModel.currentUser?.uid,
        header: "User's",
        filterVariant: 'checkbox',
        filterFn: 'includes',
        size: 164,
        muiFilterCheckboxProps: {
          color: 'primary',
        },
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        Cell: ({ cell }) =>
          new Date(cell.row.original.createdAt.seconds * 1000).toLocaleDateString(), //custom cell renderer
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
        // hidden by default
        hidden: true,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    getRowId: (row) => row.scenarioText,
    columns,
    data: toJS(viewModel.data),

    enableBottomToolbar: false,

    enableFullScreenToggle: false,

    enableRowActions: true,
    positionActionsColumn: 'last',
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 120, //if using layoutMode that is not 'semantic', the columns will not auto-size, so you need to set the size manually
        grow: false,
      },
    },
    renderRowActions: (row) => (
      <FlexRow>
        <IconButton component={RouterLink} to={`/scenario/${row.row.original.id}`}>
          <QueryStats />
        </IconButton>
        {row.row.original.createdBy === appModel.authModel.currentUser?.uid && (
          <DeleteButton
            onDelete={() => appModel.functionsModel.removeScenario(row.row.original.id)}
          />
        )}
      </FlexRow>
    ),

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
      sorting: [{ id: 'rating', desc: true }],

      columnVisibility: {
        createdAt: false,
        userMade: false,
      },
    },
  });

  return <MaterialReactTable css={fullSize} table={table} />;
});
