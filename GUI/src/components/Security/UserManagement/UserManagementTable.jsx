import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import { withStyles, Link } from '@material-ui/core';
import { Permission, IVHTable, Button, Pagination as TablePagination } from 'components/common';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  tdMinWidth: {
    minWidth: '160px'
  },
  tableScroll: {
    overflow: 'auto'
  },
  buttonMarginLeft: {
    marginLeft: '10px'
  },
  row: {},
  actions: {
    color: theme.palette.text.secondary
  }
});

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5
    };
  }

  componentWillReceiveProps(nextProps) {
    const { flagPageClean } = this.props;
    if (nextProps.flagPageClean && nextProps.flagPageClean !== flagPageClean) {
      this.setState({ page: 0, rowsPerPage: 5 });
    }
  }

  handleChangePage = (event, page) => {
    const { rowsPerPage } = this.state;
    const { handleGetUsers } = this.props;
    handleGetUsers(page, rowsPerPage);
    this.setState({ page });
  };

  onChangeRowsPerPage = event => {
    const { page } = this.state;
    const { handleGetUsers } = this.props;
    handleGetUsers(page, event.target.value);
    this.setState({
      rowsPerPage: event.target.value
    });
  };

  render() {
    const { selected, handleSelectAllClick, handleCheckboxClick, data } = this.props;
    const { rowsPerPage, page } = this.state;
    return (
      <React.Fragment>
        <IVHTable
          keyId="userUuid"
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
      </React.Fragment>
    );
  }

  tableExtraCellAccess = item => {
    const { handleOpenUserRolesDialog } = this.props;
    return (
      <Permission materialKey="M4-56">
        {/* <Button onClick={() => handleOpenUserRolesDialog(item.userId)}>
          {I18n.t('security.userManagement.tableButton.assignRole')}
        </Button> */}
        <Link onClick={() => handleOpenUserRolesDialog(item.userId)}>
          <Typography color="primary" variant="subtitle2" component="span">
            {I18n.t('security.userManagement.tableButton.assignRole')}
          </Typography>
        </Link>
      </Permission>
    );
  };

  tableExtraCellAction = item => {
    const { openUpdateUserPage, handleDeleteUser, classes } = this.props;
    return (
      <React.Fragment>
        <Permission materialKey="M4-2">
          {/* <Button color="primary" size="small" onClick={() => openUpdateUserPage('update', item)}>
            {I18n.t('security.userManagement.tableButton.updateUser')}
          </Button> */}
          <Link onClick={() => openUpdateUserPage('update', item)}>
            <Typography color="primary" variant="subtitle2" component="span">
              {I18n.t('security.userManagement.tableButton.updateUser')}
            </Typography>
          </Link>
        </Permission>
        <Permission materialKey="M4-3">
          <Button
            className={classes.buttonMarginLeft}
            color="primary"
            onClick={() => handleDeleteUser([item.userUuid])}
          >
            {I18n.t('security.userManagement.tableButton.deleteUser')}
          </Button>
        </Permission>
      </React.Fragment>
    );
  };

  extraCell = {
    columns: [
      {
        title: I18n.t('security.userManagement.userTable.access'),
        dataIndex: ''
      },
      {
        title: I18n.t('security.userManagement.userTable.action'),
        dataIndex: ''
      }
    ],
    components: [
      {
        component: this.tableExtraCellAccess,
        key: '12'
      },
      {
        component: this.tableExtraCellAction,
        key: '13'
      }
    ]
  };

  columns = [
    {
      title: I18n.t('security.userManagement.userTable.userId'),
      dataIndex: 'userId',
      renderItem: item => {
        const { handleOpenDetailDialog, classes } = this.props;
        return (
          <a
            onClick={() => handleOpenDetailDialog(Object.assign({}, item))}
            className={classes.actions}
          >
            {item.userId}
          </a>
        );
      }
    },
    {
      title: I18n.t('security.userManagement.userTable.fullName'),
      dataIndex: 'userFullName'
    },
    {
      title: I18n.t('security.userManagement.userTable.email'),
      dataIndex: 'userEmail'
    }
  ];
}

UserTable.propTypes = {
  selected: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  handleSelectAllClick: PropTypes.func.isRequired,
  handleCheckboxClick: PropTypes.func.isRequired,
  openUpdateUserPage: PropTypes.func.isRequired,
  handleDeleteUser: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserTable);
