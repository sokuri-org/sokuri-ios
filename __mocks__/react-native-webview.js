const React = require('react');

const WebView = React.forwardRef((props, ref) => {
  return React.createElement('View', { ...props, ref });
});
WebView.displayName = 'WebView';

module.exports = { WebView };
