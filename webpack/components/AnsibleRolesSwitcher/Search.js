import React from 'react';
import { TypeAheadSelect } from 'patternfly-react';
import PropTypes from 'prop-types';

import SearchInput from 'foremanReact/components/common/SearchInput';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
  }

  onClear = (clearFunc, clearQueryFunc) => () => {
    this.setState({ searchValue: '' });
    clearFunc(clearQueryFunc(this.state.searchValue));
  }

  onSearchChange = (searchFunc, searchQueryFunc) => (event) => {
    this.setState({ searchValue: event.target.value })
    searchFunc(searchQueryFunc(this.state.searchValue));
  }

  render() {
    const { searchFunc, searchQueryFunc, onClearFunc, onClearQueryFunc } = this.props;

    return (
      <SearchInput onClear={this.onClear(onClearFunc, onClearQueryFunc)}
                   onSearchChange={this.onSearchChange(searchFunc, searchQueryFunc)}
                   searchValue={this.state.searchValue}
                   timeout={200} />
    )
  }
}

Search.propTypes = {
  searchFunc: PropTypes.func,
  searchQueryFunc: PropTypes.func,
  clearFunc: PropTypes.func,
  clearQueryFunc: PropTypes.func
}

Search.defaultProps = {
  searchFunc: () => {},
  clearFunc: () => {},
  searchQueryFunc: string => string,
  clearQueryFunc: string => string
}

export default Search;
