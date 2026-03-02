const React = require('react');

const SwipeListView = React.forwardRef((props, ref) => {
  return React.createElement('View', { ...props, ref });
});
SwipeListView.displayName = 'SwipeListView';

module.exports = { SwipeListView };
