/**
 * Keep list of all components to be updated on layout change.
 * Update components using forceUpdate() method.
 */

class Tracker {
  /**
   * Constructor
   */
  constructor() {
    this._components = new Map();
    this._isUpdating = false;
  }

  /**
   * Start tracking updates to component
   * @param {ReactComponent} component
   */
  add(component) {
    this._components.set(component, true);
  }

  /**
   * Stop tracking updates to component
   * @param {ReactComponent} component
   */
  remove(component) {
    this._components.delete(component);
  }

  /**
   * Update all tracked components
   */
  updateComponents() {
    this._isUpdating = true;
    this._components.forEach((value, component) => this._components.set(component, false));
    this._components.forEach((value, component) => {
      if (value === false) {
        component.forceUpdate();
        this.setUpdated(component);
      }
    });
    this._isUpdating = false;
  }

  /**
   * Is updating
   * @returns {Boolean}
   */
  isUpdating() {
    return this._isUpdating;
  }

  /**
   * Mark component updated.
   * @param {ReactComponent} component
   */
  setUpdated(component) {
    if (this._components.has(component)) {
      this._components.set(component, true);
    }
  }
}

export default new Tracker();
