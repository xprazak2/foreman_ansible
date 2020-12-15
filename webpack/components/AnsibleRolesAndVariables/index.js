import React from 'react';
import { Table, TableHeader, TableBody, TableVariant, expandable } from '@patternfly/react-table';
import { Checkbox } from '@patternfly/react-core';

class ImportRolesAndVariablesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCompact: true,
            columns: [
                {
                    title: 'check',
                    cellFormatters: [expandable]
                },
                'Branches',
                { title: 'Name' },
                { title: '' /* deliberately empty */, dataLabel: 'Label for mobile view' }
            ],
            rows: [
                {
                    cells: ['one', 'two', 'three', 'four']
                },
                {
                    isOpen: true,
                    cells: ['parent - 1', 'two', 'three', 'four']
                },
                {
                    parent: 1,
                    cells: ['single cell']
                },
                {
                    isOpen: true,
                    cells: ['parent - 2', 'two', 'three', 'four']
                },
                {
                    parent: 3,
                    fullWidth: true,
                    cells: ['single cell - fullWidth']
                },
                {
                    isOpen: true,
                    cells: ['parent - 3', 'two', 'three', 'four']
                },
                {
                    parent: 5,
                    noPadding: true,
                    cells: ['single cell - noPadding']
                },
                {
                    isOpen: true,
                    cells: ['parent - 4', 'two', 'three', 'four']
                },
                {
                    parent: 7,
                    noPadding: true,
                    fullWidth: true,
                    cells: ['single cell - fullWidth & noPadding']
                },
                {
                    isOpen: true,
                    cells: ['parent - 5', 'two', 'three', 'four']
                },
                {
                    parent: 9,
                    cells: [
                        {
                            title: "spans 'Header cell' and 'Branches'",
                            props: {
                                colSpan: 2
                            }
                        },
                        {
                            title: "spans 'Pull requests' and the empty column",
                            props: {
                                colSpan: 2
                            }
                        }
                    ]
                },
                {
                    isOpen: true,
                    cells: ['parent - 6', 'two', 'three', 'four']
                },
                {
                    parent: 11,
                    fullWidth: true,
                    cells: [
                        {
                            title: "fullWidth, spans the collapsible column and 'Header cell'",
                            props: {
                                colSpan: 2
                            }
                        },
                        {
                            title: "fullWidth, spans 'Branches' and 'Pull requests'",
                            props: {
                                colSpan: 2
                            }
                        },
                        'fullWidth, spans the empty column'
                    ]
                }
            ]
        };
        this.onCollapse = this.onCollapse.bind(this);
        this.toggleCompact = this.toggleCompact.bind(this);
    }

    onCollapse(event, rowKey, isOpen) {
        const { rows } = this.state;
        /**
         * Please do not use rowKey as row index for more complex tables.
         * Rather use some kind of identifier like ID passed with each row.
         */
        rows[rowKey].isOpen = isOpen;
        this.setState({
            rows
        });
    }

    toggleCompact(checked) {
        this.setState({
            isCompact: checked
        });
    }

    render() {
        const { columns, rows, isCompact } = this.state;
        return (
          <React.Fragment>
            <Checkbox
            label="Compact"
            isChecked={isCompact}
            onChange={this.toggleCompact}
            aria-label="toggle compact variation"
            id="toggle-compact"
            name="toggle-compact"
            />
            <Table
            aria-label="Expandable table"
            variant={isCompact ? TableVariant.compact : null}
            onCollapse={this.onCollapse}
            rows={rows}
            cells={columns}>
              <TableHeader/>
              <TableBody/>
            </Table>
          </React.Fragment>
    );
    }
}
export default ImportRolesAndVariablesTable;
