# brass

轻量级响应式状态管理器

# 安装

```bash
yarn add @jaqen404/brass
```

or

```bash
npm install @jaqen404/brass
```

# 使用

```js
import { createBrass } from "brass";
const state = {
    count: 1,
    people: {
        name: "tom",
        age: 11,
    },
};
const actions = {
    add: (amount: number) => (state: any) => {
        state.count += amount;
    },
    changeName: (name: string) => (state: any) => {
        state.people.name = name;
    },
};
const getters = {
    doubleCount: (state: State) => state.count * 2,
};
export const brass = createBrass(state, getters, actions);
```

vue

```js
// 显示count的值
<div>{{count}}<div>

<script>
import
setup({

})
</script>
```
