import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function PuspaTableToolbar({ numSelected, filterName, onFilterName }) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

PuspaTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
