//var el = require('./element-es6');
import el from './element-es6';
import { diff } from './diff.js';

// var ul = el('ul', {id: 'list'}, [
//   el('li', {class: 'item','data-src': 'xxxxx'}, ['Item 1']),
//   el('li', {class: 'item'}, ['Item 2']),
//   el('li', {class: 'item'}, ['Item 3'])
// ])

// var root = ul.render();


let ul = el('ul', { id: 'list' }, [
  el('li', { class: 'item' }, ['Item 1']),
  el('li', { class: 'item' }, ['Item 2'])
])
let ul1 = el('ul', [
  el('li', { class: 'item1' }, ['Item 4']),
  el('li', { class: 'item2' }, ['Item 5'])
])
let patches = diff(ul, ul1);
console.log(patches);
var root = ul.render();
document.body.appendChild(root);