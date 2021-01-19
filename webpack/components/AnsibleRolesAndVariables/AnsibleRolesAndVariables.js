import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  cellWidth,
} from '@patternfly/react-table';
import { Button,
  Toolbar,
  ToolbarGroup,
  ToolbarContent,
  ToolbarItem, Checkbox,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  EmptyState,
  Pagination,
  } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { post } from 'foremanReact/redux/API';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import {
  ANSIBLE_ROLES_INDEX,
  ANSIBLE_ROLE_CONFIRM_IMPORT_PATH,
  DEFAULT_PER_PAGE,
} from './AnsibleRolesAndVariablesConstants';
import { prepareResult } from './AnsibleRolesAndVariablesHelpers';

const ImportRolesAndVariablesTable = ({
  columnsData,
  rowsData,
  proxy,
}) => {
  const columns = columnsData.map(col => ({
    ...col,
    transforms: [cellWidth(10)],
  }));
  const [rows, setRows] = useState(rowsData);

  const [isChecked, setIsChecked] = useState(false);
  const [selectedRowsCount, setSelectRowsCount] = useState(0);

  const dispatch = useDispatch();
  const [page, setPage] =useState();
  const [perPage, setPerPage]= useState(DEFAULT_PER_PAGE);
  const [paginatedRows, setPaginatedRows]= useState(rows.slice(0, perPage));

  debugger;

  const onSelect = (event, isSelected,rowId, row) => {
    const selectableRowLength = rows.filter(row => row.parent === undefined).length;
    var rowsCount = selectedRowsCount;
    var tempRows = rows.map(tempRow=> {
      if (rowId === -1)
      {
        tempRow.selected = isSelected;
        setIsChecked(isSelected);
        setSelectRowsCount(isSelected ? selectableRowLength : 0);

      }
      else if (tempRow.id === row.id)
      {
        tempRow.selected = isSelected;
        rowsCount = isSelected ? selectedRowsCount + 1 : selectedRowsCount - 1;
        setIsChecked(rowsCount === 0 ? false : rowsCount === selectableRowLength ? true : null);
        setSelectRowsCount(rowsCount);
      }
      return tempRow;
    });
    setRows(tempRows);
  };

  const SelectAll = (checked) => {
    onSelect(null, checked, -1);
  };

  const onSubmit = () => {
    const params = prepareResult(rows);
    dispatch(
      post({
        key: 'import_ansible_v_r',
        url: ANSIBLE_ROLE_CONFIRM_IMPORT_PATH,
        params: { changed: params, proxy },
        handleSuccess: () => dispatch(push(ANSIBLE_ROLES_INDEX)),
      })
    );
  };

  const onCancel = () => {
    dispatch(push(ANSIBLE_ROLES_INDEX));
  };

  const handleSetPage = (event, newPage, perPage, startIdx, endIdx) =>
  {
    setPage(newPage);
    setPaginatedRows(rows.slice(startIdx, endIdx))
  };

  const handlePerPageSelect = (event, newPerPage, newPage, startIdx, endIdx) =>
  {
    setPerPage(newPerPage);
    setPage(newPage);
    setPaginatedRows(rows.slice(startIdx, endIdx));
  };

  const renderPagination = (variant = 'top') =>
  {
    if (rows.length !== 0)
    {
      return (
        <Pagination
          isCompact
          itemCount={rows.length}
          page={page}
          perPage={perPage}
          defaultToFullPage
          onSetPage={handleSetPage}
          onPerPageSelect={handlePerPageSelect}
          perPageOptions={[
            { title: '3', value: 3 },
            { title: '5', value: 5 },
            { title: '10', value: 10 },
          ]}
          titles={{
            paginationTitle: `${variant} pagination`
          }}
        />
      );
    };
  };

  const renderSelectAll = () =>
  {
    if (rows.length !== 0)
    {
      return(
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup variant="icon-button-group">
              <ToolbarItem>
              <Checkbox
                isChecked={isChecked}
                onChange={SelectAll}
                aria-label="select all checkbox"
                id="select-all"
                name="select-all"
                label={isChecked ? 'Deselect all' : 'Select all'}
               />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      );
    };
  };

  const renderNotFound = () =>
  {
    if (rows.length === 0)
    {
      return(
        <EmptyState>
          <EmptyStateIcon icon={SearchIcon} />
          <Title headingLevel="h2" size="lg"> No Roles found </Title>
          <EmptyStateBody> All Roles and variables are synced are imported from the smart proxy</EmptyStateBody>
        </EmptyState>
      );
    };
  };

  const renderSubmitAndCancel = () =>
  {
    if (rows.length !==0 )
    {
      return(
        <div>
          <br />
          <br />
          <Button variant="primary" onClick={onSubmit}> Submit </Button>
          <Button variant="secondary" onClick={onCancel}> Cancel </Button>
        </div>
      );
    };
  };

  return (
    <React.Fragment>
      {renderSelectAll()}
      <Table
        aria-label="import roles and variables"
        onSelect={onSelect}
        rows={paginatedRows}
        cells={columns}
        canSelectAll={false}
      >
        <TableHeader />
        <TableBody />
      </Table>
      {renderNotFound()}
      {renderPagination()}
      {renderSubmitAndCancel()}

    </React.Fragment>
  );
};

ImportRolesAndVariablesTable.defaultProps = {
  columnsData: undefined,
  rowsData: [],
  proxy: undefined,
};

ImportRolesAndVariablesTable.propTypes = {
  columnsData: PropTypes.array,
  rowsData: PropTypes.array,
  proxy: PropTypes.number,
};

export default ImportRolesAndVariablesTable;
