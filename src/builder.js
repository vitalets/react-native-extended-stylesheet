/**
 * Builds all registered stylesheets and rebuilds them on orientation change
 */

import Channel from 'chnl';
import SheetList from './sheet-list';
import layout from './layout';
import globalVars from './global-vars';
import tracker from './components/tracker';

export default class {
  /**
   * Constructor
   */
  constructor() {
    this._hasLayout = false;
    this._sheetList = new SheetList();
    this.onBuild = new Channel();
  }

  /**
   * Creates stylesheet prototype that will be calculated after build
   * @param {Object} obj
   * @returns {Object}
   */
  create(obj) {
    const sheet = this._sheetList.create(obj);
    if (this._hasLayout) {
      sheet.calc(globalVars.get());
    }
    return sheet.getResult();
  }

  /**
   * Builds all created stylesheets with passed variables
   * @param {Object} [sourceVars]
   */
  build(/*sourceVars*/) {
    //globalVars.calc(sourceVars);
    // layout.init({marginTop: globalVars.get().$layoutMarginTop});
    //this._sheetList.calc(globalVars.get());
    //this.onBuild.dispatch();
  }

  setGlobals(sourceVars) {
    if (!sourceVars) {
      return;
    }
    if (this._hasLayout) {
      this._calcSheets({force: true});
      tracker.updateComponents();
    }
  }

  setLayout({width, height}) {
    if (!layout.set({width, height})) {
      return;
    }
    this._calcSheets();
    if (this._hasLayout) {
      tracker.updateComponents();
    } else {
      // no need to re-render components on first layout calculation:
      // in case of app-container: it will re-render them
      // in case of manual call of `setLayout`: it should be made before first render
      this._hasLayout = true;
    }
  }

  _calcSheets(params) {
    this._sheetList.calc(globalVars.get(), params);
  }
  /*
  _listenLayoutUpdate() {
    layout.onUpdated.addListener(isFirst => {
      // console.warn('layout updated', layout.width, layout.height);
      this._sheetList.calc(globalVars.get());
      tracker.updateComponents();
    });
  }
  */
}
