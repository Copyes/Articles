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

> 使用 Flex 居中一个圆

```html
<body>
  <div class="circle"></div>
</body>
```

```css
html {
  width: 100%;
  height: 100%;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 100%;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: red;
}
```

> 使用 css 实现垂直居中

简单的居中大概是可以分为两类的：

* 文本居中，只需要在他的父标签上指定高度（height）与相同的行高（line-height）即可。
* 标签元素的居中方式比较多，也比较复杂

```html
<div class="container">
  <div class="vertical">

  </div>
</div>
```

```css
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.container {
  width: 100%;
  height: 100%;
}

.vertical {
  width: 100px;
  height: 100px;
  background: red;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  /* 将元素沿 Y 轴方向移动自身的 50% */
}
```

> CSS 的怪异盒模型

由于某些历史遗留问题，CSS 的盒子模型有两种标准：W3C 和 IE 。怪异盒模型主要表现在 IE 上，当不对 Doctype 进行定义时，会触发怪异模式。

标准盒模型中，一个 `block` 的总宽度 = `width + margin-left + margin-right + padding-left + padding-right + border-left + border-right`
而怪异盒模型中，一个 `block` 的总宽度 = `width + margin-left + margin-right` ，`width` 包含了 `padding` 和 `border` ；高度也是一样的区别。在 CSS3 中，box-sizing 指定为 border-box 时，会采用怪异盒计算。

> BFC 的相关理解

> rem , em 和 px 的区别

在 CSS 中，em 和 rem 都属于灵活的单位，都会由浏览器根据实际情况转换成 px 值。

* 任何浏览器的默认字体高度都是 16px 。当然我们可以通过设置 font-size 强行改变这个高度。
* em 是相对长度单位。相对于当前对象内文本的字体尺寸。em 会继承父级元素的字体大小
* rem 是 CSS3 新增的一个相对长度单位，r 是 root 的缩写。使用 rem 为元素设定字体大小时，仍然是相对大小，但相对的只是 HTML 根元素。

px 根据不同人理解是不同的。比如说设计师理解的 px 是设备像素，而相对于前端工程师来说 px 是逻辑像素。在 CSS 规范中，长度单位可以分为两类，绝对(absolute)单位以及相对(relative)单位。px 是一个相对单位，相对的是设备像素(device pixel)。

要做设备像素与 CSS 像素之间的转换，现来看两个概念：

* 每英寸像素：ppi，表示每英寸所拥有的像素(pixel)数目，数值越高，代表显示屏能够以越高的密度显示图像
* 设备像素比：根据计算出的 ppi 和基本密度分界，获得默认缩放比例，即设备像素比。（先规定密度分界基数为 160，然后设备像素比=ppi 除以密度分界基数 160）
  ![密度分界](https://upload-images.jianshu.io/upload_images/8133-ef1f05dc254add2e.jpg)
