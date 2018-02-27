### HTML & CSS 相关知识总结

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

> 移动端布局方案

由于移动端的屏幕尺寸的比例不固定，所以布局的时候大多采用的是流式布局。移动端布局需要注意下面几点：

* 指定好相关的 viewport
  * `width`: 设置 `viewport` 的宽度（即之前所提及到的，浏览器的宽度详），这里可以为一个整数，又或者是字符串"width-device"
  * `initial-scale`: 页面初始的缩放值，为数字，可以是小数
  * `minimum-scale`: 允许用户的最小缩放值，为数字，可以是小数
  * `maximum-scale`: 允许用户的最大缩放值，为数字，可以是小数
  * `height`: 设置`viewport`得高度（一般不设置）
  * `user-scalable`: 是否允许用户进行缩放，'no' 为不允许，'yes' 为允许

```html
<script type="text/javascript">
  ! function(a) {
    function b() {
        a.rem = f.getBoundingClientRect().width / 16, f.style.fontSize = a.rem + "px"
    }
    var c, d = a.navigator.appVersion.match(/iphone/gi) ? a.devicePixelRatio : 1,
        e = 1 / d,
        f = document.documentElement,
        g = document.createElement("meta");
    if (a.dpr = d, a.addEventListener("resize", function() {
            clearTimeout(c), c = setTimeout(b, 300)
        }, !1), a.addEventListener("pageshow", function(a) {
            a.persisted && (clearTimeout(c), c = setTimeout(b, 300))
        }, !1), f.setAttribute("data-dpr", d), g.setAttribute("name", "viewport"), g.setAttribute("content", "initial-scale=" + e + ", maximum-scale=" + e + ", minimum-scale=" + e + ", user-scalable=no"), f.firstElementChild) {
          f.firstElementChild.appendChild(g);
    } else {
      var h = document.createElement("div");
      h.appendChild(g), document.write(h.innerHTML)
    }
    b();
}(window);
```

以上代码是动态计算 viewport 的。根据不通的 dpr 计算出不通的 rem。目前已经应用在线上项目了。

* 利用好 rem
  经过上面的代码后，设计稿就按照 750px 来设计了。写的时候就按照尺寸／rem 就好了
  ```css
  @base: 46.875rem;
  div {
    width: 200/@base;
    height: 200/@base;
  }
  ```
  移动端适配方案：
  [https://github.com/riskers/blog/issues/17](https://github.com/riskers/blog/issues/17)
  [https://github.com/riskers/blog/issues/18](https://github.com/riskers/blog/issues/18)

> CSS 边距折叠的问题

块的顶部外边距和底部外边距有时被组合(折叠)为单个外边距，其大小是组合到其中的最大外边距，这种行为称为外边距塌陷(margin collapsing)，有的地方翻译为外边距合并。

发生外边距塌陷的三种情况：

* 相邻的兄弟姐妹元素
  ```html
  <p style="margin-bottom: 30px;">这个段落的下外边距被合并...</p>
  <p style="margin-top: 20px;">...这个段落的上外边距被合并。</p>
  ```
* 块级父元素与其第一个/最后一个子元素

  如果块级父元素中，不存在上边框、上内边距、内联元素、块格式化上下文、 清除浮动 这五条（也可以说，当上边框宽度及上内边距距离为 0 时），那么这个块级元素和其第一个子元素的上边距就可以说”挨到了一起“。此时这个块级父元素和其第一个子元素就会发生上外边距合并现象，换句话说，此时这个父元素对外展现出来的外边距将直接变成这个父元素和其第一个子元素的 margin-top 的较大者。

* 空块元素

  如果存在一个空的块级元素，其 border、padding、inline content、height、min-height 都不存在。那么此时它的上下边距中间将没有任何阻隔，此时它的上下外边距将会合并

  ```html
  <p style="margin-bottom: 0px;">这个段落的和下面段落的距离将为20px</p>
  <div style="margin-top: 20px; margin-bottom: 20px;"></div>
  <p style="margin-top: 0px;">这个段落的和上面段落的距离将为20px</p>
  ```
