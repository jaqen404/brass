# brass

基于[RxJS](https://github.com/ReactiveX/rxjs)和[Immer](https://github.com/immerjs/immer)的轻量级响应式状态管理器

## 安装

```bash
yarn add @jaqen404/brass
```

or

```bash
npm install @jaqen404/brass
```

## 使用

```js
// store.js
import { createStore } from "brass";
const state = {
    count: 1,
    people: {
        name: "tom",
        age: 11,
    },
};
const getters = {
    doubleCount: (state: State) => state.count * 2,
};
const mutations = {
    add: (amount: number) => (state: any) => {
        state.count += amount;
    },
    changeName: (name: string) => (state: any) => {
        state.people.name = name;
    },
};
const actions = {
    doAsync: (a: number, b: number) => async (mutations: any) => {
        await new Promise((resolve: any) => {
            setTimeout(resolve, 3000);
        });
        mutations.sum(a, b);
        return a + b;
    },
};
export const firstStore = createStore(
    "firstStore",
    state,
    getters,
    mutations,
    actionss
);
```

```js
// 响应式获取 state
import { state$ } from "@jaqen404/brass";
let state = {};
state$.subscribe((data: any) => {
    state = data.state;
});
```

```js
// 响应式获取 getters
import { getters$ } from "@jaqen404/brass";
let getters = {};
getters$.subscribe((data: any) => {
    getters = data.getters;
});
```

```js
// 同时获取 state | getters
import { brassData$ } from "@jaqen404/brass";
let getters = {};
let state = {};
brassData$.subscribe((data: any) => {
    state = data.state;
    getters = data.getters;
});
```

```js
// 使用 mutations
import { firstStore } from "./store";
firstStore.mutations.add(1);
```

```js
// 使用 actions
import { firstStore } from "./store";
firstStore.actions.doAsync(10, 100);
```

```js
// 使用 setState
import { firstStore } from "./store";
firstStore.setState((state) => {
    state.people.name = state.people.name + state.count;
});
```

## vue 中使用

[vue-brass 插件](https://github.com/jaqen404/vue-brass)

## FAQ

### 命名由来？

> Brass 伯明翰，是一款经典的德式策略桌面游戏，背景是优雅而辉煌的维多利亚时代，玩家扮演工业革命期间白手起家的商人，缔造属各自的英伦传奇。

<img src="https://cf.geekdo-images.com/UIlFaaTmaWms7F5xdEFgGA__imagepage/img/SitcV7akzI3P_dl8pPEneEpM-U4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3549793.jpg" width="300" height="153" />
