---
title: useEffect：不是生命週期，是同步
date: 2026-09-15 16:16:26
categories: Technology
tags:
---


## 一、為什麼需要 `useEffect`？從純函式說起

React 的 component 被設計成 **Pure Function 純函式**：同樣的 props 進去，應該吐出同樣的 UI 描述，過程中不去碰外面的世界。

但真實的應用一定要碰外面的世界。📖《React 思維進化》 5-1 把這類行為稱為**Side Effect 副作用（side effect）**——與外部環境有關的互動：

<!-- more -->

- 存取函式外的變數
- 發起網路請求
- 直接修改 DOM element
- 註冊 timer、event listener、訂閱

所以 `useEffect` 的存在理由不是「提供生命週期鉤子」，而是**幫副作用找一個合法的出口**，讓它被隔離到 render 流程跑完之後才執行，不阻塞渲染。

這條線串起來是：

```text
Functional Programming → 純函式 → 副作用 → useEffect
```

> 官方也是這樣分的：render 過程中不能有副作用，副作用要放在 event handler 或 Effect 裡。
> [Keeping Components Pure > Where you can cause side effects](https://react.dev/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

---

## 二、`useEffect` 不是生命週期 API

這是我認為最重要、也最晚才想通的一件事。

課程筆記裡我曾整理過觸發順序：

1. component 第一層的函式
2. render 內的函式
3. `useEffect`

搭配 dependency 的三種寫法：

| dependency | 行為 |
| --- | --- |
| 不給陣列 | 每次 render 後都執行 |
| `[]` 空陣列 | 只在初始化（mount）執行一次 |
| `[a, b]` 非空陣列 | 陣列中的值改變時才執行 |

這張表沒有錯，但用「生命週期」去記它，會在複雜情境下失效。📖《React 思維進化》5-2 的標題講得很直接：**useEffect 其實不是 function component 的生命週期 API**。

> useEffect 並不是在特定的生命週期觸發，而是在**需要的時候**就會觸發。重點不是「它何時被觸發」，而是「它被觸發了」——這是宣告式的思維。

換句話說，`[]` 不代表「我要在 mount 時做事」，而是「這個副作用不依賴任何會變動的值，所以只需要同步一次」。前者是命令式的排程，後者是宣告式的描述。寫法一樣，心智模型完全不同。

官方文件的章節名稱也印證了這點：不叫 lifecycle，叫 [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)——**同步**，不是生命週期。

至於「初始化」到底是哪個階段？答案是 Mount 階段裡的 **Commit Phase**：DOM 真的掛到畫面上之後，`useEffect` 才會執行。

---

## 三、Dependency：一個常被誤用的「條件」

我第一個真正的卡關是這樣的：資料請求寫在 `useEffect` 裡，畫面就開始「毫不停歇」地跑。解法是補上 `[]`。

但補完之後真正該問的是：**為什麼？**

因為 dependency 不是「觸發條件」，而是「這個副作用讀到了哪些會變的值」的清單。React 在每次 render 後，用 [Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 逐項比對這份清單；有變才重跑。沒給清單，就等於宣告「我每次都要重跑」。

這帶出兩個必踩的坑：

### 1. `setState` 寫在 effect 裡、又把該 state 放進 dependency

這組合會直接爆炸：effect 改了 state → state 變了 → dependency 變了 → effect 再跑 → 無限迴圈。

官方對這題的建議是用 updater function，把「讀取舊值」的需求從 dependency 裡拿掉：

```jsx
// ❌ count 在 dependency 裡，effect 又改 count
useEffect(() => {
  setCount(count + 1);
}, [count]);

// ✅ 用 updater，不需要把 count 列為 dependency
useEffect(() => {
  setCount(c => c + 1);
}, []);
```

參考：[Updating state based on previous state from an Effect](https://react.dev/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect)、[My Effect keeps re-running in an infinite cycle](https://react.dev/reference/react/useEffect#my-effect-keeps-re-running-in-an-infinite-cycle)

### 2. 對 ESLint 說謊

📖《React 思維進化》5-3 的標題是「不要欺騙 hooks 的 dependencies」。看到 `React Hook useEffect has a missing dependency` 時，把變數從清單裡刪掉是最快的止痛法，也是最貴的技術債——你等於告訴 React「這個值不會影響我」，然後在某個未來的 render 拿到過期的閉包值。

正確的處理方向通常是：把值移進 effect 裡、用 updater function、或把函式本身搬進 effect。

### 3. 順帶一提：只在 effect 裡用到的函式，就宣告在 effect 裡

我曾收到一個 code review 建議：「如果一個函式只在 `useEffect` 中被呼叫，就直接宣告在 `useEffect` 裡面。」

理由正是 dependency：宣告在元件層的函式每次 render 都是新的參考，一旦被列入 dependency 就會讓 effect 每次都重跑；不列入又會觸發 ESLint 警告。搬進 effect 內部，這個兩難就消失了。

---

## 四、Cleanup：從「跑兩次」到記憶體洩漏

### 為什麼 effect 會跑兩次？

React 18 的在開發環境會刻意「掛載 → 卸載 → 再掛載」一次，讓沒寫 cleanup 的 effect 立刻現形。這不是 bug，是壓力測試。

參考：[My Effect runs twice when the component mounts](https://react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts)、📖《React 求職特訓營》 2.3、📖《React 思維進化》 5-4。

如果你的 effect 跑兩次會出事，代表它**本來就有問題**——只是正式環境還沒讓你看到。

### Cleanup 在解什麼問題？

解的是**記憶體洩漏**。

Unmount 的時機比想像中多：conditional rendering、路由切換、父元件或自身 re-render。每一次 unmount，如果先前註冊的 timer、event listener、訂閱、未完成的請求沒有被撤銷，它們就會繼續活著、繼續持有已經不存在的元件的參考。頁面於是「越跑越慢」（《React 求職特訓營》2.1）。

官方把寫 effect 拆成三步，第三步就是這件事：

1. 宣告 effect
2. 指定 dependency
3. **需要的話，加上 cleanup**

```jsx
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer); // cleanup：消除或逆轉上一次的副作用
}, []);
```

參考：[Step 3: Add cleanup if needed](https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

心智模型上，cleanup 不是「元件死掉時的告別式」，而是「**下一次同步之前，先把上一次的同步撤掉**」。這也是為什麼它在每次 dependency 變動時都會跑，而不只在 unmount 時跑。

---

## 五、幾條實務上的硬規則

- **`useEffect` 只能寫在元件的第一層**，不能包在條件式或迴圈裡。
- **callback 不能直接是 `async function`**。因為 `useEffect` 的回傳值被保留給 cleanup function，而 async function 一定回傳 Promise。要非同步就在裡面再包一層：

```jsx
useEffect(() => {
  const run = async () => {
    const res = await fetch(url);
    // ...
  };
  run();
}, [url]);
```

- **一個元件可以有很多個 `useEffect`**。不要為了「少一個 hook」把不相關的副作用塞在一起——按關注點拆開，dependency 才會乾淨。
- **不是所有計算都該進 `useEffect`**。可以從現有 state 直接推導出來的值，就在 render 時算；用 effect 去「同步」一份衍生 state，只會多一次 render 和一組 bug（《React 求職特訓營》2.5）。

---

## 六、一句話的心智模型

> `useEffect` 不是「在某個時間點做某件事」，而是「**讓外部系統跟我的 state 保持同步**」。
>
> dependency 是「同步依據哪些值」，cleanup 是「怎麼撤掉上一次的同步」。

把這句話放在前面，本文提到的每個坑——無限迴圈、跑兩次、記憶體洩漏、過期閉包——都會從「要背的例外」變成「同一個原理的推論」。

---

## Reference

- [Synchronizing with Effects – React](https://react.dev/learn/synchronizing-with-effects)
- [useEffect – React (API Reference)](https://react.dev/reference/react/useEffect)
- [Lifecycle of Reactive Effects – React](https://react.dev/learn/lifecycle-of-reactive-effects)
- [Keeping Components Pure – React](https://react.dev/learn/keeping-components-pure)
- [Object.is() – MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
- [如何避免前端系統的記憶體洩漏 (memory leak)？｜ExplainThis](https://www.explainthis.io/zh-hant/swe/frontend-memory-leak)