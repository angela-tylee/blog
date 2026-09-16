---
title: 什麼是作用域 (Scope)？以及提升(Hoisting)、遮蔽 (Shadowing)、Lexical Scope、TDZ、參數的傳遞方式
date: 2025-04-16 14:29:00
categories: Technology
tags:
---

先上一些情境題 ：

（參考自六角卡斯伯老師《帶你無痛提升 JavaScript 面試力》）

```jsx
var fn = function() {
  console.log('恩娣');
}
fn();
function fn() {
  console.log('小明');
}
```
<!-- more -->

```jsx
var myName = '小明'
function fn1() {
	console.log(myName);
}
function fn2() {
	var myName = '恩娣';
	fn1();
}
fn2();
```

```jsx
var myName = '小明';
function fn1() {
  console.log(myName);
}
function fn2() {
  myName = '恩娣';
  fn1();
}
fn2();
```

```jsx
var myName = '小明';
function fn1(myName) {
  console.log(myName);
}
function fn2() {
  var myName = '恩娣';
  fn1(myName);
}
fn2();
```

```jsx
var myName = '小明';
function fn1(myName) {
  console.log(myName);
}
function fn2() {
  myName = '恩娣';
  fn1(myName);
}
fn2();
```

心中都有答案了嗎？如果還有疑問，就代表正缺乏作用域、提升、遮蔽、語法作用域…等相關知識，可以繼續看下去

在這邊我問自己的問題是：

「如何確保在執行程式時 JavaScript 取用到正確的變數 / 函式？宣告變數 / 函式時，我應該要在哪裡做宣告？」

## 作用域 (Scope)

看幾段關於作用域的敘述：

> *“The **scope** is the current context of execution in which values and expressions are "visible" or can be referenced. If a variable or expression is not in the current scope, it will not be available for use.”* - MDN Web Docs
> 

> *“JavaScript does have function scope. That means that the parameters and variables defined in a function are not visible outside of the function.” — 《JavaScript: The Good Parts》*
> 

由此可知，在作用域外的變數，在作用域內形同是看不到的

因此了解作用域，等同於了解變數宣告後可以在哪個**範圍**內被取用

### JavaScript 的作用域

- 全域 (Global Scope)
- 函式作用域 (Function Scope)：`var`  宣告的變數
- 區塊作用域 (Block Scope)：`let`、`const` 宣告的變數

!函式作用域

函式作用域

!區塊作用域

區塊作用域

!區塊作用域

區塊作用域

<aside>
<img src="/icons/info-alternate_purple.svg" alt="/icons/info-alternate_purple.svg" width="40px" />

**小提示 / 補充知識**

在 ES6 前， JavaScript 非常依賴全域變數 (Global variable) 和 函式作用域 (Function scope)，一直是非常令人詬病的問題

後來隨著 ES6 推出 let、const，區塊作用域 (Block scope) 也隨之出現，解決變數作用域過大而衍伸出的問題

</aside>

範例：

```jsx
{
  let x = 1;
}
console.log(x); // x is not defined

// let 屬於區塊作用域，所以在區塊作用域外無法取得 x 的值
```

```jsx
funtion fn() {
  let x = 1;
  x = 2;
}
let x = 3;
fn();
console.log(x); // 3

// let 屬於區塊作用域，所以即使函式執行了，在函式外面仍舊取得的是全域 x 的值
```

### 為什麼要有作用域的設計？

麻煩死了，為什麼要限制變數可以取用的範圍，還因此出現一堆反直覺的錯誤？

作用域的目的及優點：

- 提高程式碼可維護性、模組化的可能性
    - 不同作用域的變數都是獨立的，不會產生命名衝突
    - 可避免意外修改或覆蓋已經被宣告的變數
- 幫助記憶體管理，當作用域的使用已經結束（且沒有被閉包使用時），其內部的變數佔用的記憶體會釋放

<aside>
<img src="/icons/book-closed_blue.svg" alt="/icons/book-closed_blue.svg" width="40px" />

**延伸閱讀**

閉包：函式：封裝（好的封裝）、閉包 Counter II *(work in progress)*...

</aside>

## 提升 (Hoisting)

JavaScript 並沒有一個固定做變數宣告的區域，你可以在任何地方宣告變數

然而 JavaScript 在執行程式碼時，會將程式碼的順序重新整理，**將特定段落的程式碼移至該作用域最上方**

這邊重新整理的方式，便被稱為「提升」(Hoisting)

被提升的程式碼為：

- **變數宣告**（賦值段落除外）
    - `var` 會被提升到全域或函式作用域的最前方
    - `let、const` 會被提升到區塊作用域的最前方
- **函式陳述式**

<aside>
<img src="/icons/warning_yellow.svg" alt="/icons/warning_yellow.svg" width="40px" />

**注意**

只有變數宣告 (declaration) 部分會提升，賦值 (assignment) 段落會留在原地

!variable-declaration-assignment.png

範例：

```jsx
console.log(a) // undefined
var a = 'Hello'
console.log(a) // 'Hello'
```

```jsx
// 創造階段
var a;
console.log(a); // undefined，宣告部分被提升了所以印不出值

// 執行階段
a = 'Hello'
console.log(a); // 'Hello'
```

</aside>

範例：變數宣告的提升

```jsx
var number = 1;

function test() {
  number = 2;
  var number;
  console.log(number); 
}

test();
console.log(number);
```

```jsx
var number = 1;

function test() {
	var number;          // 變數宣告提升
  number = 2;
  console.log(number); // 2 (不是全域的 1，也不是 undefined!)
}

test();
console.log(number); // 1
```

範例：函式陳述式的提升

```jsx
var fn = function() {
  console.log('恩娣');
}
fn();
function fn() {
  console.log('小明');
}
```

```jsx
// 創造階段
function fn() {             // 函式陳述式
    console.log('小明');
}
var fn;

// 執行階段
fn = function() {           // 函式表達式
    console.log('恩娣');
}
fn(); // '恩娣'
```

<aside>
<img src="/icons/book-closed_blue.svg" alt="/icons/book-closed_blue.svg" width="40px" />

**延伸閱讀**

變數宣告以及 var, let, const 的差異 

表達式 (Expression) vs 陳述式 (Statement)、函式陳述式 vs 函式表達式 

</aside>

可參考 Udacity 說明影片，有清楚的視覺演示：

Source: [Intro to JavaScript | Udacity](https://youtu.be/8z-HSS34dsM)

Source: Intro to JavaScript | Udacity

### 為什麼要有提升的設計？

- 提升的目的：
    - 於 JavaScript **創造階段**，建立變數與函式在記憶體中的位置（登記變數與函式的名稱於記憶體中）
    - 這些行為是為了讓 JavaScript 引擎在**執行階段**時能快速知道：變數在哪裡、屬於哪個作用域、是否已宣告

- 提升附帶的優點如下：
    - 提升撰寫的彈性 → 減少心智負擔，開發上更有效率
        - 可先使用再宣告，開發者能更專注在邏輯流程，而不必過度在意宣告順序，讓開發更有效率。
    - 提升可讀性、維護性 → 宣告可集中管理，便於維護
        - 函式或變數宣告可集中管理，讓整體結構更清晰，方便日後維護與擴充。
        - 可以將**主流程寫在前面，細節函式集中於後面**，實現「先看概要、後看細節」的撰寫模式，有利於程式碼的結構化與維護。
    - 降低入門撰寫的難度 → 即使不完全理解執行順序，也能寫出可執行的程式碼，有助於初學者入門。

<aside>
<img src="/icons/help-alternate_pink.svg" alt="/icons/help-alternate_pink.svg" width="40px" />

**詞彙解釋**

- **創造階段 (creation)：**
    - **建立變數與函數**：，JavaScript 會將宣告的變數及函數載入到記憶體中
    - **提升（Hoisting）**：變數宣告、函數宣告、函式陳述式會被「提升」到作用域的頂部（`var` 宣告的變數會被創建並初始化為 `undefined`）
    - 確認作用域範圍（語法作用域）
    - 完成閉包記憶體留存
- **執行階段 (execution)：**
    - **執行變數賦值**：在這個階段，賦值段落會被執行，變數會被賦予實際的值。
    - **執行函數呼叫**：函數會在執行階段運行
</aside>

## 遮蔽 (Shadowing)

再來要談到一個情境：如果在子層父層都有相同命名的變數（或參數），何者會優先被取用呢？

答案是：向外(父層)查找，並優先取用離自己最近的變數

*“Scopes can also be layered in a hierarchy, so that child scopes have access to parent scopes, but not vice versa.”* - MDN Web Docs

從外層的角度來看，如果內部已經有同名的變數，就無法取用到外層的變數，就像是被內層的變數「遮蔽」了一樣

範例：

```jsx
var myName = "小明";
function fn1(myName) {
  console.log(myName);
}
function fn2() {
  var myName = "恩娣"; // 優先取用 fn2 內部的 myName
  fn1(myName);
}
fn2(); // 恩娣
```

參考 Udacity 影片：

Source: [Intro to JavaScript | Udacity](https://youtu.be/NMLG2PQ6RRM)

Source: Intro to JavaScript | Udacity

### 變數 vs 參數：參數的傳遞方式

```jsx
let name = 'John';

function greet(name) {
  console.log('Hello, ' + name);
}

greet('Alice');  // 印出 'Hello, Alice'，有參數時優先使用參數
greet(name);     // 印出 'Hello, John'，同名參數時向外查找到 'John'
greet();         // 印出 'Hello, undefined’，參數預設值為 `undefined`
```

## 語法作用域 (Lexical Scope)

先看一題，這邊的 `fn1()` 會取用到哪一個 `myName`  的值呢？

```jsx
var myName = '小明'
function fn1() {
	console.log(myName);
}
function fn2() {
	var myName = '恩娣';
	fn1();
}
fn2(); // 恩娣
```

原因在於「語法作用域 (Lexical Scope)」：在 JavaScript 中，**變數查找永遠根據函式的定義位置，而不是呼叫位置**

因此 `fn1`在撰寫完成時就已確定作用域與將取用的變數，並不受呼叫時的環境影響

語法作用域 (Lexical Scope) 是現代主流程式語言的語法特徵，也是 JavaScript 的一大語法優點

語法作用域使得程式更好預測，在撰寫完時就可以更容易預見將如何執行

<aside>
<img src="/icons/info-alternate_purple.svg" alt="/icons/info-alternate_purple.svg" width="40px" />

**小提示 / 補充知識**

語法作用域 (Lexical Scope) 也稱作 Static Scope，與其相反的是 Dynamic Scope

具有 Dynamic Scope 的語言，是在**函式被呼叫時**才決定變數的作用域

| 特徵 | 語法作用域（Lexical Scope） | 動態作用域（Dynamic Scope） |
| --- | --- | --- |
| 變數解析方式 | 根據程式碼結構 | 根據執行階段的呼叫堆疊 (call stack) |
| 使用的語言 | JavaScript、Python、Java、C、Rust 等 | LaTeX and the shell languages bash, dash |
</aside>

## 暫死區 / 暫時死區 (TDZ, Temporal Dead Zone)

暫死區僅適用於 `let`、`const` 宣告的變數

<aside>
<img src="/icons/book-closed_blue.svg" alt="/icons/book-closed_blue.svg" width="40px" />

**參考資料 / 延伸閱讀**

變數宣告以及 var, let, const 的差異 

</aside>

<aside>
<img src="/icons/help-alternate_pink.svg" alt="/icons/help-alternate_pink.svg" width="40px" />

**詞彙解釋**

**TDZ (Temporary Dead Zone) 暫死區：**

從作用域開頭，到變數宣告的地方，這段範圍不能取用`let` 或 `const` 宣告的變數

該變數存在但不能被存取，否則會拋出錯誤

```jsx
{
  // TDZ starts at beginning of scope
  console.log(bar); // "undefined"
  console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
  var bar = 1;
  let foo = 2; // End of TDZ (for foo)
}
```

下方範例中，使用 `var` 宣告（沒有TDZ)，在 count 初始化前就取用 count，因此無法獲得正確的值，但也沒有獲得報錯，開發者不容易發現此處已經出錯

```jsx
if (!count) {
  console.log(count); // undefined
}
var count = 1;
```

若是使用 `let` 宣告，在 count 初始化前就取用 count，等同在 TZD 取值，得到報錯 `Reference Error: Cannot access 'counts' before initialization`

```jsx
// start of TDZ
if (!count) {
  console.log(count); // ❌ Reference Error: Cannot access 'counts' before initialization
}
let count = 1; // end of TDZ
```

</aside>

## 總結

- 作用域 (Scope)：
    - 限制變數可取用的範圍
    - 3 種作用域：
        - 全域
        - 函式作用域
        - 區塊作用域
- 提升 (Hoist)：
    - 在 JavaScript 創造階段，將變數 / 函式移動到作用域最上方
    - 目的是登記記憶體位置，以利執行階段時順利執行
    - 提升的段落：
        - 變數宣告
        - 函式陳述式
- 遮蔽 (Shadow)：
    - 查找變數的順序：由內向外查找
    - 有多個相同命名的變數及參數時，優先取用離函式宣告位置最近的的變數
- 語法作用域 (Lexical Scope):
    - 程式撰寫完成時（創造階段），即確定該段程式碼的作用域，不會在執行階段再有變動
- 暫死區 / 暫時死區 (TDZ, Temporal Dead Zone)
    - 從作用域的最上方到 `let`、`const` 變數宣告的地方，都是暫時死區
    - 暫死區內不能取用變數

## 後記

在查找資料的過程中，我聯想到從剛開始接觸程式，到這一路上學了許多工具與底層邏輯。

剛開始覺得這些規則很麻煩又多餘，但是漸漸理解到任何規則通常都有他想要解決的問題。一旦熟悉了，規則就可以為我所用，讓我的開發過程更加輕鬆。

大部分的工具和規範都有其優點及隨之而來的缺點，想必 JavaScript 的編譯邏輯也是如此。而優秀的工程師從來都沒有放棄尋找更優的解法，才因此不斷有新的語法功能、工具推出，我想這也是工程師需要持續學習的原因吧

覺得學習疲勞、迷茫的時候，我試著去查找這些技術想解決的問題，便有動力熬過認識陌生概念的階段，進而享受更愉快的開發體驗。

有感而發，共勉之。

## 參考資料

https://www.w3schools.com/js//js_scope.asp
https://developer.mozilla.org/en-US/docs/Glossary/Scope
https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz
https://www.udacity.com/enrollment/ud803
*《帶你無痛提升 JavaScript 面試力》Ch 1 變數與作用域*
https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scope
https://www.geeksforgeeks.org/static-and-dynamic-scoping/