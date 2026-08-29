# 浏览器兼容与性能参考

记录日期：2026-08-29

本文件记录跨浏览器验证工具、渲染性能判断和项目转译边界。来源只用于确定测试能力与优化原则，不把特定浏览器内部实现写成产品功能。

## 公开来源

- [Playwright Browsers](https://playwright.dev/docs/browsers)：确认 Playwright 提供 Chromium、Firefox、WebKit 及 Chrome/Edge 品牌通道，并说明其 Firefox 与 WebKit 构建不同于普通稳定浏览器；
- [Playwright BrowserContext API](https://playwright.dev/docs/api/class-browsercontext)：确认 CDP 会话只由 Chromium 系浏览器提供，因此 CPU、网络与 CDP 渲染指标不能伪装成 Firefox/WebKit 的同类数据；
- [WebKit Features in Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/)：用于核对 `content-visibility` 等现代 CSS 能力进入 Safari 的时间及滤镜可能增加渲染通道的风险；
- [Introducing the Rendering Frames Timeline](https://webkit.org/blog/3996/introducing-the-rendering-frames-timeline/) 与 [Visualizing Layers in Web Inspector](https://webkit.org/blog/8262/visualizing-layers-in-web-inspector/)：用于将一帧中的脚本、样式、布局、绘制和合成视为完整预算，并检查大型图层与重绘关系；
- [How Web Content Can Affect Power Usage](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/)：用于识别固定元素、持续动画和不可见内容仍可能引起绘制的风险；
- [MDN CSS performance optimization](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS)、[`contain`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain) 与 [`content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility)：用于核对 CSS 滤镜、阴影、固定层、布局隔离和跳过屏外渲染的通用边界。

## 项目采用的测试转译

- 功能冒烟复用同一断言，分别在 Playwright Chromium、Firefox、WebKit 与实际 Google Chrome、Microsoft Edge 稳定版运行；不为某个引擎维护较弱的功能清单；
- 跨引擎性能证据使用相同视口、页面、污染状态、滚动轨迹和 `requestAnimationFrame` 帧间隔，关闭 CPU 与网络模拟；只有 Chromium 系的单引擎限速研究读取 CDP 指标；
- 每份结果记录引擎与版本、原始样本、中位数和 P95，不用一次最快结果代表整体，也不将头部渲染器名称替代真实设备说明；
- Linux Playwright WebKit 用于尽早暴露 WebKit 绘制、布局和脚本差异。它不包含 macOS Safari 的全部平台字体、媒体栈、输入系统与平台渲染行为，因此不能独立证明 Safari 已通过；
- 大型纯装饰污染层允许预先合并为项目原创 SVG 或位图，只保留一次解码与合成。状态、可访问文本、本地化投影、焦点、真实内容和控件继续由 HTML/CSS/TypeScript 承担。

## 本轮使用与排除

本轮只采用“跨引擎复用断言”“按帧预算定位重绘”“减少大面积滤镜、模糊阴影和长页面伪元素”“将无语义装饰合并为单一原创环境资产”等抽象原则。没有复制浏览器厂商示例页面、调试器界面、代码或图像，也没有根据 UA 字符串隐藏效果、为 Firefox/Safari 提供低强度污染，或把 `content-visibility` 当成未经测量的通用修复。
