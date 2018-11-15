import React from 'react';
import { TypeAheadSelect } from 'patternfly-react';
import PropTypes from 'prop-types';

import SearchInput from 'foremanReact/components/common/SearchInput';

class ConnectedSearch extends React.Component {
  onClear = (clearFunc, clearQueryFunc) => () => {
    this.props.filterInputChange('');
    // clearFunc(clearQueryFunc(''));
  }

  onSearchChange = (searchFunc, searchQueryFunc) => (event) => {
    this.props.filterInputChange(event.target.value)
    // searchFunc(searchQueryFunc(event.target.value));
  }

  render() {
    const { searchFunc, searchQueryFunc, clearFunc, clearQueryFunc } = this.props;

    return (
      <SearchInput onClear={this.onClear(clearFunc, clearQueryFunc)}
                   onSearchChange={this.onSearchChange(searchFunc, searchQueryFunc)}
                   searchValue={this.props.filterString}
                   timeout={200} />
    )
  }
}

ConnectedSearch.propTypes = {
  searchFunc: PropTypes.func,
  searchQueryFunc: PropTypes.func,
  clearFunc: PropTypes.func,
  clearQueryFunc: PropTypes.func
}

ConnectedSearch.defaultProps = {
  searchFunc: () => {},
  clearFunc: () => {},
  searchQueryFunc: string => string,
  clearQueryFunc: string => string
}

export default ConnectedSearch;
