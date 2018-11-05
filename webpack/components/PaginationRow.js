//  stolen from katello
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paginator } from 'patternfly-react';
import { isEqual } from 'lodash';

const defaultPerPageOptions = [5, 10, 15, 20, 25, 50];

const initPagination = (paginationFromProps) => {
  const pagination = paginationFromProps || {};

  const defaultPagination = {
    page: 1,
    perPage: 20,
    perPageOptions: defaultPerPageOptions,
  };
  return { ...defaultPagination, ...pagination };
};

class PaginationRow extends Component {
  constructor(props) {
    super(props);

    this.onPageSet = this.onPageSet.bind(this);
    this.onPerPageSelect = this.onPerPageSelect.bind(this);
  }

  onPageSet(page) {
    this.update({ page });
    this.props.onPageSet(page);
  }

  onPerPageSelect(perPage) {
    this.update({ perPage, page: 1 });
    this.props.onPerPageSelect(perPage);
  }

  update(changes) {
    const newPagination = { ...this.props.pagination, ...changes };

    this.props.onChange({
      page: newPagination.page,
      perPage: newPagination.perPage,
    });
  }

  render() {
    const {
      onPageSet, onPerPageSelect, pagination, ...otherProps
    } = this.props;

    return (
      <Paginator
        {...otherProps}
        pagination={initPagination(pagination)}
        onPageSet={this.onPageSet}
        onPerPageSelect={this.onPerPageSelect}
        dropdownButtonId={this.props.dropdownButtonId}
      />
    );
  }
}

PaginationRow.defaultPerPageOptions = defaultPerPageOptions;

PaginationRow.defaultProps = {
  onChange: () => {},
  ...Paginator.defaultProps,
};

PaginationRow.propTypes = {
  ...Paginator.propTypes,
  /** page and per-page selection callback */
  onChange: PropTypes.func,
  pagination: PropTypes.shape({
    /** the current page */
    page: PropTypes.number,
    /** the current per page setting */
    perPage: PropTypes.number,
    /** per page options */
    perPageOptions: PropTypes.array,
  })
};

export default PaginationRow;
