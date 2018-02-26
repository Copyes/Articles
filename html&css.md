### HTML & CSS 相关知识总结

##### CSS 实现三列布局的方案（左右两列宽度固定，中间自适应）：

> 圣杯布局

主要是对负边距的利用。使用负边距，将左右两边的盒子移动到中间盒子的两边。

```html
<div class="container">
  <div class="middle"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

```css
.container {
  padding: 0 200px;
}

.container > div {
  height: 200px;
  float: left;
}

.middle {
  width: 100%;
  background: blue;
}

.left {
  margin-left: -100%;
  position: relative;
  left: -200px;
  width: 200px;
  background: red;
}

.right {
  margin-left: -200px;
  position: relative;
  right: -200px;
  width: 200px;
  background: yellow;
}
```

[一篇关于圣杯布局的文章](https://alistapart.com/article/holygrail)

> 双飞翼布局

这个是淘宝出来的布局。也是利用了负边距，相对于圣杯布局，这里的样式写法好理解点。

```html
<div class="container">
    <div class="middle">
      <div class="middle-container"></div>
    </div>
    <div class="left"></div>
    <div class="right"></div>
  </div>
```

```css
.container > div {
  float: left;
  height: 200px;
}

.middle {
  width: 100%;
  background: red;
}

.middle-container {
  height: 200px;
  margin: 0 200px;
  background: darkred;
}

.left {
  width: 200px;
  margin-left: -100%;
  background: blue;
}

.right {
  width: 200px;
  margin-left: -200px;
  background: yellow;
}
```

> Flex 布局

Flex 是 CSS3 中的提供的属性。

```html
<div class="container">
  <div class="col-1"></div>
  <div class="col-2"></div>
  <div class="col-3"></div>
</div>
```

```css
.container {
  display: flex;
  width: 100%;
}

.container > div {
  height: 200px;
  flex: 1;
  border: 1px solid red;
}
```
