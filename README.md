# [React Gradient Color](https://github.com/CiroMzy/react-gradient-color/)

### 功能展示
 [演示链接](http://mazhaoyang.cn/demos/react-gradient-color)


- 内置多个默认颜色，可直接选择
![Mou icon](./docs/imgs/1.png)

- 自由切换 gradientType
- 添加颜色停止点
- 每个点位置调整
- 颜色选取
- 历史选取记录
- 点击删除梯度，重新选择

![Mou icon](./docs/imgs/2.png)
![Mou icon](./docs/imgs/3.png)
![Mou icon](./docs/imgs/4.png)

### 环境介绍
- 基于react
- 基于react color
- "antd": "^4.18.2"



### 参数
 * @param {string} value 当前选中渐变颜色
 * @param {fn} onChange 当前选中颜色更新
 * @param {object} style 容器样式
```jsx
<GradientColor
  value=""
  onChange={onChange}
  style={{height: "100px"}}
/>
```





