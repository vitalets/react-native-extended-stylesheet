/**
 * Actual info about current layout.
 * Initially reads from Dimensions, then listen updates.
 *
 * Provides following values:
 * - width
 * - height
 * - orientation
 * - aspect-ratio
 */

class Layout {
  /**
   * Constructor
   */
  constructor() {
    this._state = Object.create(null);
  }
  /**
   * Init layout
   * @param {Object} params
   * @param {Number} [params.marginTop] margin top to adjust height for top status bar
   */
  //init(params = {}) {
  //  const {width, height} = Dimensions.get('window');
  //  this._state.marginTop = typeof params.marginTop === 'number' ? params.marginTop : 0;
  //  this.calc({width, height});
  //}
  /**
   * Sets width & height
   * @param {Number} width
   * @param {Number} height
   */
  set({width, height}) {
    const isFirst = Object.keys(this._state).length === 0;
    // save width/height only for the first time (when AppContainer is rendered without children)
    // next time just check orientation
    if (isFirst) {
      this._state.width = width;
      this._state.height = height;
    }

    // const newOrientation = width > height ? 'landscape' : 'portrait';

    if (width !== this._state.width || height !== this._state.height) {
      Object.assign(this._state, {
        width,
        height,
        // workingHeight: height - this._state.marginTop,
        orientation: width > height ? 'landscape' : 'portrait',
        aspectRatio: width / height,
      });
      return true;
    }
    return false;
  }
  /**
   * Update layout state
   * @param {Object} params
   * @param {String} params.orientation
   */
  //update(params) {
  //  if (params.orientation !== this._state.orientation) {
  //    this.calc({width: this._state.height, height: this._state.width});
  //    this.onUpdated.dispatch();
  //  }
  //}
  /**
   * Width
   * @returns {Number}
   */
  get width() {
    return this._state.width;
  }
  /**
   * Height
   * @returns {Number}
   */
  get height() {
    return this._state.height;
    // return this._state.workingHeight;
  }
  /**
   * Orientation
   * @returns {String} landscape|portrait
   */
  get orientation() {
    return this._state.orientation;
  }
  /**
   * aspectRatio
   * @returns {Number}
   */
  get aspectRatio() {
    return this._state.aspectRatio;
  }
  /**
   * Is orientation landscape
   * @returns {Boolean}
   */
  get isLandscape() {
    return this._state.orientation === 'landscape';
  }
  /**
   * Is orientation portrait
   * @returns {Boolean}
   */
  get isPortrait() {
    return this._state.orientation === 'portrait';
  }
  /**
   * Margin top - difference between Dimensions.get('window').height and real working height
   * Noticed only on Android as Dimensions return height with top status bar.
   * @returns {Number}
   */
  get marginTop() {
    return this._state.marginTop;
  }
}

/**
 * Make a singleton
 */
export default new Layout();
