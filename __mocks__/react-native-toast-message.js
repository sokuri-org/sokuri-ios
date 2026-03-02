const React = require('react');

const Toast = React.forwardRef((props, ref) => {
  return React.createElement('View', { ...props, ref });
});
Toast.displayName = 'Toast';
Toast.show = jest.fn();
Toast.hide = jest.fn();

module.exports = Toast;
module.exports.default = Toast;
