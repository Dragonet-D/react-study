import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-i18nify';
import {
  Grid,
  Input,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
  withStyles
} from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import { Button, DialogTitle } from 'components/common';
import { ButtonSmall } from 'components/common/material-ui/CellWithTooltip';
import { Search, ExpandMore } from '@material-ui/icons';
import { TabRow, TabCell, Tab } from './RoleManagementCollapseTable';

const styles = theme => ({
  panelRoot: {
    boxShadow: 'none',
    borderTop: `1px solid ${grey[400]}`,
    borderBottom: `1px solid ${grey[400]}`
  },
  panelRootSeleted: {
    boxShadow: theme.shadows[1]
  },
  summaryRoot: {
    height: 50,
    minHeight: 40,
    padding: 0,
    '&$summaryExpanded': {
      minHeight: 50,
      borderRight: `2px solid ${blue[500]}`,
      borderLeft: `2px solid ${blue[500]}`
    }
  },
  summaryExpanded: {},
  detailRoot: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column'
  },

  tabRowSize: {
    paddingRight: 32
  },

  headTitle: {
    fontWeight: 'bold',
    paddingRight: 32
  },
  checkbox: {
    paddingTop: 0,
    paddingBottom: 0
  },
  expandIcon: {
    color: blue[500]
  },
  expansionPanelExpanded: {
    marginBottom: 16,
    '&:first-child': {
      marginTop: 16
    }
  }
});

class FeatureDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      index: 0,
      searchValueFe: '',
      isSearch: false,
      searchInputBlank: false
    };

    this.timer = null;
  }

  handleSearchChange = event => {
    const searchValueFe = event.target.value;

    // void rendering continuously due to onchange event
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        searchValueFe
      });

      clearTimeout(this.timer);
      this.timer = null;
    }, 200);
  };

  handleSearchBtnClickEvent = () => {
    let { searchValueFe } = this.state;
    const { handleSearch } = this.props;
    searchValueFe = searchValueFe.trim();
    handleSearch(searchValueFe);

    this.setState({
      isSearch: true,
      searchInputBlank: !searchValueFe
    });
  };

  handleDialogCloseClickEvent = () => {
    const { closeFeatureDialog } = this.props;
    closeFeatureDialog();
    this.setState({
      isSearch: false,
      searchInputBlank: false
    });
  };

  handleSaveFeatureClickEvent = () => {
    const { save } = this.props;
    save();
    this.setState({
      isSearch: false,
      searchInputBlank: false
    });
  };

  render() {
    const { index, isSearch, searchInputBlank } = this.state;
    const {
      featureList,
      featureListTree,
      openFeatureDialog,
      handleFeatureSelected,
      handleFeatureAllSelected,
      handleFeatureModuleSelected,
      isSelectedFeature,
      selectedFeatures,
      mode, // for Api Key show feature
      classes
    } = this.props;
    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open={openFeatureDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {mode
            ? I18n.t('security.apiKey.featureList')
            : I18n.t('security.roleManagement.title.assignFeature')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4} style={{ display: mode ? 'none' : 'flex' }}>
            <Grid item>
              <Input
                onChange={event => this.handleSearchChange(event)}
                id="adornment-amount"
                placeholder={I18n.t('security.roleManagement.placeholder.searchFeature')}
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item>
              <ButtonSmall
                size="small"
                color="default"
                variant="contained"
                onClick={this.handleSearchBtnClickEvent}
              >
                {I18n.t('security.roleManagement.button.filter')}
              </ButtonSmall>
            </Grid>
          </Grid>
          <div>
            <div style={{ marginTop: '20px', position: 'relative' }}>
              <TabRow className={classes.headTitle}>
                {!mode && (
                  <TabCell className={classes.checkbox}>
                    <Checkbox
                      color="primary"
                      checked={
                        selectedFeatures.length === featureList.length &&
                        selectedFeatures.length > 0
                      }
                      onClick={handleFeatureAllSelected}
                      style={{ paddingLeft: 0 }}
                    />
                  </TabCell>
                )}
                {featureListTree && featureListTree.length > 0 ? (
                  <>
                    <TabCell title="Feature Name">
                      {I18n.t('security.roleManagement.featureTable.featureName')}
                    </TabCell>
                    <TabCell title="Description">
                      {I18n.t('security.roleManagement.featureTable.description')}
                    </TabCell>
                  </>
                ) : (
                  <TabCell title="Description">{I18n.t('global.remindInformation.noData')}</TabCell>
                )}
              </TabRow>
              {!isSearch || (isSearch && searchInputBlank) ? (
                <TableRoot
                  featureListTree={featureListTree}
                  handleFeatureSelected={handleFeatureSelected}
                  handleFeatureAllSelected={handleFeatureAllSelected}
                  isSelectedFeature={isSelectedFeature}
                  selectedFeatures={selectedFeatures}
                  handleFeatureModuleSelected={handleFeatureModuleSelected}
                  classes={classes}
                  index={index}
                  mode={mode}
                />
              ) : (
                <SearchTable
                  item={featureListTree}
                  handleFeatureSelected={handleFeatureSelected}
                  handleFeatureAllSelected={handleFeatureAllSelected}
                  isSelectedFeature={isSelectedFeature}
                  selectedFeatures={selectedFeatures}
                  handleFeatureModuleSelected={handleFeatureModuleSelected}
                  classes={classes}
                  index={index}
                />
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSaveFeatureClickEvent} color="primary">
            {I18n.t('security.roleManagement.button.assign')}
          </Button>
          <Button onClick={this.handleDialogCloseClickEvent} color="primary" autoFocus>
            {I18n.t('security.roleManagement.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(FeatureDialog);

function SearchTable({
  item,
  classes,
  handleFeatureSelected,
  handleFeatureModuleSelected,
  handleFeatureAllSelected,
  isSelectedFeature,
  selectedFeatures,
  index
}) {
  return (
    <div>
      {item.map(temp => (
        <SearchTableItem
          key={temp.featureUuid}
          item={temp}
          handleFeatureSelected={handleFeatureSelected}
          handleFeatureAllSelected={handleFeatureAllSelected}
          isSelectedFeature={isSelectedFeature}
          selectedFeatures={selectedFeatures}
          handleFeatureModuleSelected={handleFeatureModuleSelected}
          classes={classes}
          index={index}
        />
      ))}
    </div>
  );
}

class SearchTableItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    };
  }

  handleExpansionPanelChange = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
  };

  render() {
    const { expanded } = this.state;
    const {
      item,
      classes,
      handleFeatureSelected,
      handleFeatureModuleSelected,
      handleFeatureAllSelected,
      isSelectedFeature,
      selectedFeatures,
      index
    } = this.props;
    const hasSelected = isSelectedFeature(item.featureUuid);
    return (
      <div className={classNames({ [classes.expansionPanelExpanded]: expanded })}>
        {!!item.children && item.children.length > 0 ? (
          <ExpansionPanel
            key={item.featureUuid}
            classes={{
              root: classNames({
                [classes.panelRootSeleted]: expanded,
                [classes.panelRoot]: !expanded
              })
            }}
            expanded={expanded}
            onChange={this.handleExpansionPanelChange}
            style={{
              background: expanded ? `rgba(33,150,243,.${item.level + 1})` : 'rgba(0,0,0,0)'
            }}
          >
            <ExpansionPanelSummary
              classes={{ root: classes.summaryRoot, expanded: classes.summaryExpanded }}
              expandIcon={<ExpandMore className={classNames({ [classes.expandIcon]: expanded })} />}
            >
              <Tab>
                <TabRow>
                  <TabCell className={classes.checkbox}>
                    <Checkbox
                      color="primary"
                      checked={hasSelected}
                      onClick={event => handleFeatureModuleSelected(event, item)}
                      value={JSON.stringify(item)}
                      style={{ paddingLeft: 50 * item.level }}
                    />
                  </TabCell>
                  <TabCell title={item.featureName}>{item.featureName}</TabCell>
                  <TabCell title={item.featureDesc}>{item.featureDesc}</TabCell>
                </TabRow>
              </Tab>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails key={item.featureUuid} classes={{ root: classes.detailRoot }}>
              <SearchTable
                item={item.children}
                classes={classes}
                handleFeatureSelected={handleFeatureSelected}
                handleFeatureAllSelected={handleFeatureAllSelected}
                isSelectedFeature={isSelectedFeature}
                selectedFeatures={selectedFeatures}
                handleFeatureModuleSelected={handleFeatureModuleSelected}
                index={index}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ) : (
          <TabRow key={item.featureUuid} className={classes.tabRowSize}>
            <TabCell className={classes.checkbox}>
              <Checkbox
                color="primary"
                checked={hasSelected}
                onClick={event => handleFeatureSelected(event)}
                value={item.featureUuid}
                style={{ paddingLeft: 50 * item.level }}
              />
            </TabCell>
            <TabCell title={item.featureName}>{item.featureName}</TabCell>
            <TabCell title={item.featureDesc}>{item.featureDesc}</TabCell>
          </TabRow>
        )}
      </div>
    );
  }
}

class TableRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: ''
    };
  }

  handleExpansionPanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const { expanded } = this.state;
    const {
      featureListTree,
      classes,
      handleFeatureSelected,
      handleFeatureModuleSelected,
      handleFeatureAllSelected,
      isSelectedFeature,
      selectedFeatures,
      index,
      mode
    } = this.props;
    return (
      <div>
        {featureListTree.map(item => {
          let hasSelected;
          if (!mode) {
            hasSelected = isSelectedFeature(item.featureUuid);
          }
          if (!!item.children && item.children.length > 0) {
            return (
              <ExpansionPanel
                key={item.featureUuid}
                classes={{
                  root: classNames({
                    [classes.panelRootSeleted]: expanded === item.featureUuid,
                    [classes.panelRoot]: !(expanded === item.featureUuid)
                  }),
                  expanded: classes.expansionPanelExpanded
                }}
                expanded={expanded === item.featureUuid}
                onChange={this.handleExpansionPanelChange(item.featureUuid)}
                style={{
                  background:
                    expanded === item.featureUuid
                      ? `rgba(33,150,243,.${item.level + 1})`
                      : 'rgba(0,0,0,0)'
                }}
              >
                <ExpansionPanelSummary
                  classes={{ root: classes.summaryRoot, expanded: classes.summaryExpanded }}
                  expandIcon={
                    <ExpandMore
                      className={classNames({
                        [classes.expandIcon]: expanded === item.featureUuid
                      })}
                    />
                  }
                >
                  <Tab>
                    <TabRow>
                      {!mode && (
                        <TabCell className={classes.checkbox}>
                          <Checkbox
                            color="primary"
                            checked={hasSelected}
                            onClick={event => handleFeatureModuleSelected(event, item)}
                            value={JSON.stringify(item)}
                            style={{ paddingLeft: 50 * item.level }}
                          />
                        </TabCell>
                      )}
                      <TabCell title={item.featureName}>{item.featureName}</TabCell>
                      <TabCell title={item.featureDesc}>{item.featureDesc}</TabCell>
                    </TabRow>
                  </Tab>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  key={item.featureUuid}
                  classes={{ root: classes.detailRoot }}
                >
                  <TableRoot
                    featureListTree={item.children}
                    classes={classes}
                    handleFeatureSelected={handleFeatureSelected}
                    handleFeatureAllSelected={handleFeatureAllSelected}
                    isSelectedFeature={isSelectedFeature}
                    selectedFeatures={selectedFeatures}
                    handleFeatureModuleSelected={handleFeatureModuleSelected}
                    index={index}
                    mode={mode}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          } else {
            return (
              <TabRow key={item.featureUuid} className={classes.tabRowSize}>
                {!mode && (
                  <TabCell className={classes.checkbox}>
                    <Checkbox
                      color="primary"
                      checked={hasSelected}
                      onClick={event => handleFeatureSelected(event)}
                      value={item.featureUuid}
                      style={{ paddingLeft: 50 * item.level }}
                    />
                  </TabCell>
                )}
                <TabCell title={item.featureName}>{item.featureName}</TabCell>
                <TabCell title={item.featureDesc}>{item.featureDesc}</TabCell>
              </TabRow>
            );
          }
        })}
      </div>
    );
  }
}
// modified by Kevin on 16/1/2019---end
