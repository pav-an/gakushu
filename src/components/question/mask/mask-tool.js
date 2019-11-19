import React, { Component, createElement } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { Button } from '../../common';
import { COLOR } from '../../../constants';

const tools = [
  {
    id: 'pencil',
    name: 'pencil',
    type: MaterialCommunityIcons,
  }, {
    id: 'line',
    name: 'flow-line',
    type: Entypo,
  }, {
    id: 'back',
    name: 'ios-backspace',
    type: Ionicons,
  },
];

const circleSizes = [7, 10, 13];

export default class MaskTool extends Component {
  static propTypes = {
    tool: PropTypes.object.isRequired,
    onChangeTool: PropTypes.func.isRequired,
    parent: PropTypes.object.isRequired,
    colors: PropTypes.array.isRequired,
    pointSizes: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
  }

  _handleToolPress = cur => {
    this.props.onChangeTool({
      ...this.props.tool,
      cur,
    });
  };

  _handleColorPress = i => {
    this.props.onChangeTool({
      ...this.props.tool,
      colorIndex: i,
    });
  };

  _handlePointSizeChange = pointSizeIndex => {
    this.props.onChangeTool({
      ...this.props.tool,
      pointSizeIndex,
    });
  };

  _handleHeadPointChange = headPointIndex => {
    this.props.onChangeTool({
      ...this.props.tool,
      headPointIndex,
    });
  }

  _renderToolItem = (tool, i) => {
    const { cur } = this.props.tool;
    return (
      <Button
        key={i}
        style={[styles.tool, tool.id === cur && styles.selectedTool]}
        onPressIn={() => this._handleToolPress(tool.id)}
        delayTime={0}
      >
        {createElement(tool.type, {
          size: 25,
          name: tool.name,
          style: tool.id === 'line' ? { backgroundColor: 'transparent', transform: [{ rotate: '45deg' }] } : {},
          color: tool.id === cur ? COLOR.GOVERNOR_BAY : COLOR.WHITE,
        })}
      </Button>
    );
  };

  _renderPointSizeBtn = (i, cur) => {
    const circleStyle = {
      borderColor: i === cur ? COLOR.GOVERNOR_BAY : COLOR.BLACK,
      borderRadius: circleSizes[ i ],
      borderWidth: circleSizes[ i ],
    };
    return (
      <View style={[styles.pointStyle, circleStyle]}></View>
    );
  }

  render() {
    const { colorIndex, pointSizeIndex, headPointIndex } = this.props.tool;
    const { colors, pointSizes } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.pointContainer}>
          {[0, 1].map(i => (
            <Button
              key={i}
              style={[styles.btnPointSize, i === headPointIndex && styles.selectedBG]}
              onPress={() => this._handleHeadPointChange(i)}
              delayTime={0}
            >
              {i === headPointIndex &&
                <View style={styles.selected}></View>
              }
              <View style={[styles.headPoint,
                i === 0 && styles.headPointCircle,
                { borderColor: i === headPointIndex ? COLOR.GOVERNOR_BAY : COLOR.BLACK },
              ]}></View>
            </Button>
          ))}
          <View style={styles.separator}></View>
          {pointSizes.map((pointSize, i) => (
            <Button
              key={i}
              style={[styles.btnPointSize, i === pointSizeIndex && styles.selectedBG]}
              onPress={() => this._handlePointSizeChange(i)}
              delayTime={0}
            >
              {i === pointSizeIndex &&
                <View style={styles.selected}></View>
              }
              {this._renderPointSizeBtn(i, pointSizeIndex)}
            </Button>
          ))}
          <View style={styles.separator}></View>
          {colors.map((color, i) => (
            <Button
              key={i}
              style={[styles.colorWrapper, i === colorIndex && styles.selectedBG]}
              onPress={() => this._handleColorPress(i)}
              delayTime={0}
            >
              <View style={[styles.color, { backgroundColor: color }]}></View>
              {i === colorIndex &&
                <View style={styles.selected}></View>
              }
            </Button>
          ))}
        </View>
        <View style={styles.toolContainer}>
          {tools.map((tool, i) => (
            this._renderToolItem(tool, i)
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.MERCURY,
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorWrapper: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  color: {
    height: 30,
  },
  toolContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  tool: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTool: {
    backgroundColor: COLOR.WHITE,
  },
  btnPointSize: {
    flex: 1,
    height: 50,
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointStyle: {
    width: 0,
    height: 0,
  },
  selected: {
    position: 'absolute',
    height: 5,
    top: 0,
    left: 0,
    right :0,
    backgroundColor: COLOR.GOVERNOR_BAY,
  },
  selectedBG: {
    backgroundColor: COLOR.WILD_SAND,
  },
  separator: {
    width: 15,
  },
  headPoint: {
    width: 0,
    height: 0,
    borderWidth: 10,
  },
  headPointCircle: {
    borderRadius: 10,
  },
});
