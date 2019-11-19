import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, PanResponder } from 'react-native';
import ExpoTHREE, { THREE } from 'expo-three';
import { GLView } from 'expo-gl';

export default class SpriteView extends Component {
  static propTypes = {
    touchDown: PropTypes.func.isRequired,
    touchMoved: PropTypes.func.isRequired,
    onSetup: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired,
    windowHeight: PropTypes.number.isRequired,
    update: PropTypes.func,
  };

  // scene;
  // camera;
  // renderer;

  worldSpaceWidth = 750 * 0.333333333;
  worldSpaceHeight = null;

  constructor() {
    super();
    this.setupGestures();
  }

  convertPosition(x, y) {
    let { width, height } = this.scene.size;
    return {
      x: (x / this.props.windowWidth * width - width / 2 ) / this.camera.zoom,
      y: (height / 2 - y / this.props.windowHeight * height) / this.camera.zoom,
    }
  }

  setupGestures = () => {
    const touchesBegan = ({ nativeEvent }) => {
      const { touches } = nativeEvent;
      touches.map(
        ({ locationX, locationY }) => {
          this.props.touchDown(this.convertPosition(locationX, locationY));
        }
      );
    };

    const touchesMoved = ({ nativeEvent }) => {
      const { touches } = nativeEvent;
      touches.map(
        ({ locationX, locationY }) => {
          this.props.touchMoved(this.convertPosition(locationX, locationY));
        }
      );
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: touchesBegan,
      onPanResponderMove: touchesMoved,
      onShouldBlockNativeResponder: () => false,
    });
  };

  takeSnapshotAsync () {
    return this.glView.takeSnapshotAsync();
  }

  render() {
    return (
      <GLView
        ref={ele => {this.glView = ele}}
        {...this.panResponder.panHandlers}
        style={StyleSheet.absoluteFill}
        onContextCreate={this._onGLContextCreate}
      />
    );
  }

  _onGLContextCreate = async gl => {
    this.scene = new THREE.Scene();

    /// Camera
    const { drawingBufferWidth: glWidth, drawingBufferHeight: glHeight } = gl;
    this.worldSpaceHeight = glHeight / glWidth * this.worldSpaceWidth;
    this.camera = new THREE.OrthographicCamera(
      this.worldSpaceWidth / -2,
      this.worldSpaceWidth / 2,
      this.worldSpaceHeight / 2,
      this.worldSpaceHeight / -2,
      0,
      1
    );

    this.scene.size = {
      width: this.worldSpaceWidth,
      height: this.worldSpaceHeight,
    };
    this.scene.bounds = {
      top: this.camera.top,
      left: this.camera.left,
      bottom: this.camera.bottom,
      right: this.camera.right,
    };

    this.camera.position.z = 1;

    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(glWidth, glHeight);
    renderer.setClearColor(0x000000, 0);

    await this.props.onSetup({ scene: this.scene, camera: this.camera });

    const render = () => {
      requestAnimationFrame(render);
      if (this.props.update) {
        this.props.update();
      }
      renderer.render(this.scene, this.camera);
      gl.endFrameEXP();
    };

    render();
  };
}
