import React from 'react';
import { makeStyles, Link } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import { AntTree, TreeNode, ToolTip } from 'components/common';
import _ from 'lodash';

const useStyles = makeStyles(() => {
  return {
    treeNodeRender: {
      display: 'flex'
    },
    deleteBut: {
      pointerEvents: 'stroke' /* SVG-only */
    }
  };
});

function AOITree(props) {
  const { dataSource, triggerLoad, AOIDisplay, camSelected, deleteAOI } = props;
  const classes = useStyles();
  const [renderData, setrenderData] = React.useState(dataSource || []);
  const [lastSelect, setlastSelect] = React.useState(null);
  React.useEffect(() => {
    if (!_.isEqual(renderData, dataSource)) {
      setrenderData(dataSource);
    }
  }, [dataSource]);

  const onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      const result = new Promise(resolve => {
        triggerLoad(treeNode.props.dataRef, resolve);
      });
      result.then(res => {
        let data = res.features;
        data = _.uniqBy(data, x => {
          return x.attributes.channelId;
        });
        const children = data.map(x => {
          return {
            zoomName: x.attributes.channelName,
            channelId: x.attributes.channelId,
            key: x.attributes.channelId,
            isLeaf: true,
            data: res.toJSON()
          };
        });
        treeNode.props.dataRef.children = children;

        resolve(renderData);
      });
    }).then(data => {
      const renderData = _.cloneDeep(data);
      setrenderData(renderData);
    });

  const onSelect = (keys, e) => {
    if (!e.selectedNodes[0]) {
      AOIDisplay();
    } else {
      const item = e.selectedNodes[0].props.dataRef;
      if (item.geometryData) {
        AOIDisplay(item);
      } else if (item.isLeaf) {
        camSelected(item);
      }
    }
  };

  const onSelect1 = item => {
    if (item.geometryId === lastSelect) {
      AOIDisplay();
      setlastSelect(null);
    } else if (item.geometryData) {
      AOIDisplay(item);
      setlastSelect(item.geometryId);
    } else if (item.isLeaf) {
      camSelected(item);
    }
  };

  const renderTitle = item => {
    if (item.isLeaf) {
      return (
        <Link
          onClick={() => {
            onSelect1(item);
          }}
        >
          {item.zoomName}
        </Link>
      );
    } else {
      return (
        <div className={classes.treeNodeRender}>
          <span>
            <Link
              onClick={() => {
                onSelect1(item);
              }}
            >
              {item.zoomName}
            </Link>
          </span>
          <span className={classes.deleteBut}>
            <ToolTip title="Delete AOI">
              <Delete
                style={{
                  pointerEvents: 'fill'
                }}
                onClick={() => {
                  deleteAOI(item.geometryId);
                  //   console.log(item);
                }}
              />
            </ToolTip>
          </span>
        </div>
      );
    }
  };

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            selectable={false}
            title={renderTitle(item)}
            key={item.geometryId || item.key}
            dataRef={item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          selectable={false}
          title={renderTitle(item)}
          key={item.geometryId || item.key}
          {...item}
          dataRef={item}
        />
      );
    });

  if (renderData) {
    return (
      <AntTree loadData={onLoadData} onSelect={onSelect}>
        {renderTreeNodes(renderData)}
      </AntTree>
    );
  }
}

export default AOITree;
