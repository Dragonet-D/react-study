import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import { withStyles } from '@material-ui/core/styles';
import { Permission, Pagination as TablePagination, IVHTable, Button } from 'components/common';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  row: {},
  buttonMarginLeft: {
    marginLeft: '10px'
  }
});

class RoleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5
    };
  }

  componentWillReceiveProps(nextProps) {
    const { flagPageClean } = this.props;
    const { flagPageCleanNextProps } = nextProps;
    if (flagPageCleanNextProps && flagPageCleanNextProps !== flagPageClean) {
      this.setState({ page: 0, rowsPerPage: 5 });
    }
  }

  handleChangePage = (event, page) => {
    const { handleGetDataByPage } = this.props;
    const { rowsPerPage } = this.state;
    handleGetDataByPage(page, rowsPerPage);
    this.setState({ page });
  };

  onChangeRowsPerPage = event => {
    const { handleGetDataByPage } = this.props;
    const { page } = this.state;
    const { value } = event.target;
    handleGetDataByPage(page, value);
    this.setState({
      rowsPerPage: value
    });
  };

  render() {
    const { data, selected, handleSelectAllClick, handleCheckboxClick } = this.props;
    const { rowsPerPage, page } = this.state;
    return (
      <Fragment>
        <IVHTable
          keyId="roleId"
          dataSource={data.items || []}
          columns={this.columns}
          extraCell={this.extraCell}
          rowSelection={{
            onChange: handleCheckboxClick,
            selectedRowKeys: selected
          }}
          handleChooseAll={handleSelectAllClick}
        />
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={data.totalNum || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
        />
      </Fragment>
    );
  }

  tableExtraCellAccess = item => {
    const { openFeatureDialog } = this.props;
    return (
      <Permission materialKey="M4-57">
        <Button color="primary" size="small" onClick={() => openFeatureDialog(item.roleId)}>
          {I18n.t('security.roleManagement.button.feature')}
        </Button>
      </Permission>
    );
  };

  tableExtraCellOperation = item => {
    const { openCreateOrUpdatePage, handleDeleteRole, classes } = this.props;
    return (
      <React.Fragment>
        <Permission materialKey="M4-10">
          <Button
            color="primary"
            size="small"
            onClick={() => openCreateOrUpdatePage('update', Object.assign({}, item))}
          >
            {I18n.t('security.roleManagement.button.update')}
          </Button>
        </Permission>
        <Permission materialKey="M4-11">
          <Button
            className={classes.buttonMarginLeft}
            color="primary"
            size="small"
            onClick={() => handleDeleteRole(item.roleId)}
          >
            {I18n.t('security.roleManagement.button.delete')}
          </Button>
        </Permission>
      </React.Fragment>
    );
  };

  extraCell = {
    columns: [
      {
        title: I18n.t('security.roleManagement.roleTable.access'),
        dataIndex: ''
      },
      {
        title: I18n.t('security.roleManagement.roleTable.operation'),
        dataIndex: ''
      }
    ],
    components: [
      {
        component: this.tableExtraCellAccess,
        key: '12'
      },
      {
        component: this.tableExtraCellOperation,
        key: '13'
      }
    ]
  };

  columns = [
    {
      title: I18n.t('security.roleManagement.roleTable.name'),
      dataIndex: 'userId',
      renderItem: item => {
        const { openCreateOrUpdatePage } = this.props;
        return <a onClick={() => openCreateOrUpdatePage('detail', item)}>{item.roleName}</a>;
      }
    },
    {
      title: I18n.t('security.roleManagement.roleTable.description'),
      dataIndex: 'roleDesc'
    }
  ];
}

RoleTable.propTypes = {
  selected: PropTypes.array.isRequired,
  handleSelectAllClick: PropTypes.func.isRequired,
  handleCheckboxClick: PropTypes.func.isRequired,
  handleDeleteRole: PropTypes.func.isRequired
};

export default withStyles(styles)(RoleTable);
