/**
 * Mixin to wrap components that should re-render on orientation change.
 *
 * @example
 *
 * class MyComponent extends React.Component { ... }
 * export default EStyleSheet.mixin(MyComponent);
 *
 * Important note:
 * React can try to update the same component twice:
 * 1. from parent component
 * 2. self
 * To avoid this we mark component updated after first render.
 */

import tracker from './tracker';

export default Component => class extends Component {
  componentDidMount() {
    if (super.componentDidMount) {
      super.componentDidMount();
    }
    tracker.add(this);
  }
  componentWillUnmount() {
    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }
    tracker.remove(this);
  }
  componentWillUpdate(...args) {
    if (super.componentWillUpdate) {
      super.componentWillUpdate(...args);
    }
    // If tracker in updating state, mark component updated on first render
    // to avoid unneeded render in batch
    if (tracker.isUpdating()) {
      tracker.setUpdated(this);
    }
  }
};
