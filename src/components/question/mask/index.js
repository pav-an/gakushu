import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ExpoTHREE, { THREE } from 'expo-three';
import { Float32BufferAttribute, ShapeUtils } from 'three';

import styles from './styles';
import { GLView } from '../../common';
import MaskTool from './mask-tool';
import { toRectangle, distance, calStraightLine } from './calculate';

const colors = [
  '#000000',
  '#404040',
  '#808080',
  '#BFBFBF',
  '#FFFFFF',
];

const pointSizes = [
  0.2,
  0.5,
  1,
];

const MAX_POINTS = 5000;

export default class Mask extends Component {
  static propTypes = {
    imageUri: PropTypes.string.isRequired,
    imageRawUri: PropTypes.string,
  };

  state = {
    windowWidth: 0,
    windowHeight: 0,
    tool: {
      colorIndex: 0,
      cur: 'pencil',
      pointSizeIndex: 2,
      headPointIndex: 0,
    },
  };

  constructor(props) {
    super(props);
    this.lineStack = [];
    this.lastLineStack = [];
    this.positionPencil = null;
    this.imageRawBG = null;
    this.currentRotate = 0;
    this.currentScale = 1;
  }

  takeScreenshot = async () => {
    const result = await this.glView.takeSnapshotAsync();
    return result.uri;
  }


  refresh = () => {
    const maxLoop = Math.max(this.lineStack.length, this.lastLineStack.length);
    let isStillSame = true;
    for (let i = 0; i < maxLoop; i++) {
      if (this.lineStack[ i ] === this.lastLineStack[ i ] && isStillSame) {
        continue;
      }
      isStillSame = false;
      if (i < this.lineStack.length) {
        this._removeLines(this.lineStack[ i ]);
        if (this.lineStack[ i ] === this.imageRawBG) {
          this.imageRawBG = null;
        }
      }
      if (i < this.lastLineStack.length) {
        this._addLines(this.lastLineStack[ i ]);
        if (this.lastLineStack[ i ] === this.imageRawBG) {
          this.imageRawBG = this.lastLineStack[ i ];
        }
      }
    }
    this.lineStack = [...this.lastLineStack];
  }

  checkPoint = () => {
    this.lastLineStack = [...this.lineStack];
  }

  adjust = rotate => {
    if (!this.scene) {
      return;
    }
    const rRotate = -rotate;
    let scale = 1;
    if ((rRotate + 90) % 180 === 0) {
      scale = 0.75;
    }
    this.currentRotate = rRotate;
    this.currentScale = scale;
    this.scene.traverse(node => {
      if (node instanceof THREE.Mesh) {
        node.scale.x = scale / node.meshScale;
        node.scale.y = scale / node.meshScale;
        node.rotation.z = (rRotate - node.meshRotation) / 180 * Math.PI;
      }
    });
  }

  _handleOnLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    this.setState({
      windowWidth: width,
      windowHeight: height,
    });
  }

  _createShape = (p1, p2) => {
    const shape = new THREE.Shape();
    const pointSize = pointSizes[ this.state.tool.pointSizeIndex ];
    const points = toRectangle(p1.x, p1.y, p2.x, p2.y, 30 * pointSize);
    for (let i = 0; i < points.length; i ++) {
      if (i === 0) {
        shape.moveTo( points[ i ].x, points[ i ].y );
      } else {
        shape.lineTo( points[ i ].x, points[ i ].y );
      }
    }
    return shape;
  }

  _createCircle = p => {
    const shape = new THREE.Shape();
    const pointSize = pointSizes[ this.state.tool.pointSizeIndex ];
    const numS = Math.floor(5 + pointSize * 25);
    for (let i = 0; i <= numS; i ++) {
      const px = p.x + 15 * pointSize * Math.sin(2 * Math.PI / numS * i);
      const py = p.y + 15 * pointSize * Math.cos(2 * Math.PI / numS * i);
      if (i === 0) {
        shape.moveTo(px , py );
      } else {
        shape.lineTo(px , py );
      }
    }
    return shape;
  }

  _createLine = () => {
    this.lineInfo = {
      drawCount: 0,
      groupStart: 0,
      verIndex: 0,
      normalIndex: 0,
      uvIndex: 0,
      indices: [],
    };

    const material = new THREE.MeshBasicMaterial({ color: colors[ this.state.tool.colorIndex ] });
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( MAX_POINTS * 3 );
    const normals = new Float32Array( MAX_POINTS * 3 );
    const uvs = new Float32Array( MAX_POINTS * 2 );

    geometry.setIndex([]);
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
    geometry.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
    geometry.setDrawRange( 0, 0 );
    const line = new THREE.Mesh( geometry, material );
    line.meshRotation = this.currentRotate;
    line.meshScale = this.currentScale;
    this.scene.add(line);
    return line;
  }

  _addShape = shape => {
    if (this.lineInfo.verIndex > MAX_POINTS * 3 - 100) {
      const line = this._createLine();
      this.line = line;
      this.lineStack[ this.lineStack.length - 1 ].push(line);
    }

    const line = this.line;
    const vertices = line.geometry.attributes.position.array;
    const normals = line.geometry.attributes.normal.array;
    const uvs = line.geometry.attributes.uv.array;

    const indexOffset = this.lineInfo.verIndex / 3;
    const points = shape.extractPoints( 12 );
    let shapeVertices = points.shape;
    const shapeHoles = points.holes;
    // check direction of vertices
    if (!ShapeUtils.isClockWise( shapeVertices )) {
      shapeVertices = shapeVertices.reverse();
      // also check if holes are in the opposite direction
      for ( let i = 0; i < shapeHoles.length; i ++ ) {
        const shapeHole = shapeHoles[ i ];
        if ( ShapeUtils.isClockWise( shapeHole ) ) {
          shapeHoles[ i ] = shapeHole.reverse();
        }
      }
    }
    const faces = ShapeUtils.triangulateShape( shapeVertices, shapeHoles );
    // join vertices of inner and outer paths to a single array
    for ( let i = 0; i < shapeHoles.length; i ++ ) {
      const shapeHole = shapeHoles[ i ];
      shapeVertices = shapeVertices.concat( shapeHole );
    }
    // vertices, normals, uvs
    for ( let i = 0; i < shapeVertices.length; i ++ ) {
      const vertex = shapeVertices[ i ];
      vertices[ this.lineInfo.verIndex++ ] = vertex.x;
      vertices[ this.lineInfo.verIndex++ ] = vertex.y;
      vertices[ this.lineInfo.verIndex++ ] = 0;

      normals[ this.lineInfo.normalIndex++ ] = 0;
      normals[ this.lineInfo.normalIndex++ ] = 0;
      normals[ this.lineInfo.normalIndex++ ] = 1;

      uvs[ this.lineInfo.uvIndex++ ] = vertex.x;
      uvs[ this.lineInfo.uvIndex++ ] = vertex.y;
    }
    // incides
    let groupCount = 0;
    for ( let i = 0; i < faces.length; i ++ ) {
      const face = faces[ i ];
      const a = face[ 0 ] + indexOffset;
      const b = face[ 1 ] + indexOffset;
      const c = face[ 2 ] + indexOffset;
      this.lineInfo.indices.push( a, b, c );
      groupCount += 3;
    }

    line.geometry.setIndex( this.lineInfo.indices );
    line.geometry.addGroup( this.lineInfo.groupStart, groupCount, this.lineInfo.drawCount );
    line.geometry.setDrawRange( 0, this.lineInfo.verIndex );

    this.lineInfo.groupStart += groupCount;
    this.lineInfo.drawCount++;
  }

  _handleTouchDown = position => {
    const line = this._createLine();
    this.line = line;
    if (this.state.tool.cur === 'line') {
      this.lineStack.push(line);
    } else if (this.state.tool.cur === 'pencil') {
      if (this.state.tool.headPointIndex === 0) {
        const circle = this._createCircle(position);
        this._addShape(circle);
      }
      this.lineStack.push([line]);
    }
    this.lastPosition = position;
    this.isFirstPosition = true;
  };

  _handleTouchMoved = position => {
    if (this.state.tool.cur === 'line') {
      const renderLinePosition = calStraightLine(this.lastPosition, position);
      if (this.state.tool.headPointIndex === 0) {
        this.shapes = [
          this._createCircle(this.lastPosition),
          this._createShape(this.lastPosition, renderLinePosition),
          this._createCircle(renderLinePosition),
        ];
      } else {
        this.shapes = [
          this._createShape(this.lastPosition, renderLinePosition),
        ];
      }
      this.line.geometry = new THREE.ShapeBufferGeometry(this.shapes);
    } else if (this.state.tool.cur === 'pencil') {
      // check distance when cur = 'pencil' and headPoint is square
      if (this.state.tool.headPointIndex === 1) {
        const d = 30 * pointSizes[ this.state.tool.pointSizeIndex ];
        if (distance(this.lastPosition, position) < d * d) {
          return;
        }
      }

      const shape = this._createShape(this.lastPosition, position);
      this._addShape(shape);
      let circlePos;
      if (this.state.tool.headPointIndex === 1) {
        if (this.isFirstPosition) {
          circlePos = null;
        } else {
          circlePos = this.lastPosition;
        }
      } else {
        circlePos = position;
      }
      if (circlePos) {
        const circle = this._createCircle(circlePos);
        this._addShape(circle);
      }
      this.line.geometry.attributes.position.needsUpdate = true;

      this.lastPosition = position;
      this.isFirstPosition = false;
    }
  };

  _setupBackground = async uri => {
    const { size } = this.scene;
    const texture = await ExpoTHREE.loadAsync(uri);

    const textureWidth = texture.image.width;
    const textureHeight = texture.image.height;
    let scaleWidth;
    let scaleHeight;
    if (size.width * textureHeight / textureWidth > size.height) {
      scaleWidth = size.height / textureHeight * textureWidth;
      scaleHeight = size.height;
    } else {
      scaleWidth = size.width;
      scaleHeight = size.width / textureWidth * textureHeight;
    }
    texture.magFilter = texture.minFilter = THREE.NearestFilter;
    const geometry = new THREE.PlaneGeometry(scaleWidth, scaleHeight, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const bg = new THREE.Mesh( geometry, material );
    bg.meshRotation = 0;
    bg.meshScale = 1;
    bg.rotation.z = this.currentRotate / 180 * Math.PI;
    bg.scale.x = this.currentScale;
    bg.scale.y = this.currentScale;
    this.scene.add(bg);

    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
    if (uri === this.props.imageRawUri) {
      this.lineStack.push(bg);
      this.imageRawBG = bg;
    }
  };

  _onSetup = async ({ scene, camera }) => {
    this.scene = scene;
    this.camera = camera;
    await this._setupBackground(this.props.imageUri);
  };

  _removeLines = lines => {
    if (!Array.isArray(lines)) {
      this.scene.remove(lines);
    } else {
      for ( let i = 0; i < lines.length; i ++ ) {
        this.scene.remove(lines[ i ]);
      }
    }
  }

  _addLines = lines => {
    if (!Array.isArray(lines)) {
      this.scene.add(lines);
    } else {
      for ( let i = 0; i < lines.length; i ++ ) {
        this.scene.add(lines[ i ]);
      }
    }
  }

  _handleOnChangeTool = tool => {
    const previousTool = this.state.tool.cur;
    const { imageRawUri } = this.props;
    this.setState({
      tool,
    }, () => {
      if (tool.cur === 'back') {
        if (this.lineStack.length === 0 && this.imageRawBG === null && imageRawUri !== '') {
          this._setupBackground(imageRawUri);
        } else if (this.lineStack.length !== 1 || this.lineStack[ 0 ] !== this.imageRawBG) {
          const lines = this.lineStack.pop();
          this._removeLines(lines);
        }
        this.setState({
          tool: {
            ...this.state.tool,
            cur: previousTool,
          },
        });
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={styles.imageContainer}
        >
          <View
            style={styles.imageWrapper}
            onLayout={this._handleOnLayout}
          >
            <GLView
              ref={ele => {this.glView = ele}}
              windowWidth={this.state.windowWidth}
              windowHeight={this.state.windowHeight}
              touchDown={this._handleTouchDown}
              touchMoved={this._handleTouchMoved}
              onSetup={this._onSetup}
            />
          </View>
        </View>
        <MaskTool
          tool={this.state.tool}
          onChangeTool={this._handleOnChangeTool}
          colors={colors}
          pointSizes={pointSizes}
          parent={this}
        />
      </View>
    );
  }
}
