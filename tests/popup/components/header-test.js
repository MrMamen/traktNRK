var React = require('react/addons');
var Header = require('../../../app/scripts/src/popup/components/header');
var TestUtils = React.addons.TestUtils;
var items = [{ name: 'Foo', show: true }, { name: 'Bar', show: false }];
var click = sinon.stub();
var header = TestUtils.renderIntoDocument(<Header items={items} onItemClicked={click} />);
var nav = TestUtils.findRenderedDOMComponentWithTag(header, 'nav');

describe('Header', function() {
  it('Renders the items', function() {
    items.map(function(item, index) {
      expect(item.name).toBe(nav.getDOMNode().children[index].textContent)
    });
  });

  it('Does not render items with show: false', function() {
    items.map(function(item, index) {
      if (item.show) {
        expect(nav.getDOMNode().children[index].style.display).toBe('block');
      } else {
        expect(nav.getDOMNode().children[index].style.display).toBe('none');
      }
    });
  });

  it('Calls on click function', function() {
    React.addons.TestUtils.Simulate.click(nav.getDOMNode().children[0]);
    expect(click.callCount).toEqual(1);
  });

  it('has the correct html classes', function() {
    var headerTag = TestUtils.findRenderedDOMComponentWithTag(header, 'header');
    var headerRow = TestUtils.findRenderedDOMComponentWithClass(header, 'mdl-layout__header-row');
    var title = TestUtils.findRenderedDOMComponentWithTag(header, 'span');
    var spacer = TestUtils.findRenderedDOMComponentWithClass(header, 'mdl-layout-spacer');
    expect(headerTag.getDOMNode().className).toBe('mdl-layout__header mdl-shadow--7dp');
    expect(headerRow.getDOMNode().className).toBe('mdl-layout__header-row');
    expect(title.getDOMNode().className).toBe('mdl-layout-title');
    expect(spacer.getDOMNode().className).toBe('mdl-layout-spacer');
    expect(nav.getDOMNode().className).toBe('mdl-navigation');
    items.map(function(item, index) {
      expect(nav.getDOMNode().children[index].className).toBe('mdl-navigation__link item-' + item.name);
    });
  });
});