---
title: 變數宣告以及 var, let, const 的差異
date: 2025-04-13 11:00:00
categories: Technology
tags: ['javascript', 'beginner']
---

第一篇獻給基礎中的基礎：變數宣告以及 var, let, const 的差異

## 什麼是變數的「宣告」？

變數的宣告，對初學時的我，就像是幫一個值命名一樣：

這位 28 歲，身高 180cm 的男子，名為 John

```jsx
let John = {
	age: 28,
	height: 180,
	gender: male
}
```

而從另一個更正確的角度來說明，是把一個值或一段程式碼回傳的值「儲存」起來

而這個值可以是字串、數值、或物件

<!-- more -->

例如：

```jsx
const res = await fetch(url);
```

>**詞彙解釋**
>
>所謂「回傳」
>
>看似基礎但把新手搞暈頭的 console.log vs return 印出值？回傳值？ work in progress…
>

由於在撰寫程式碼時，DRY (Do not repeat yourself) 是一個很基本的原則，將值儲存到變數中，幾乎是撰寫 JavaScript 的起手式

有了變數，我們才可以透過一個簡單的名稱去操作一段可能很龐大且會變動的資料

## 變數的三種宣告方法：var, let, const

JavaScript 變數有三種宣告方式：var, let, const

除了 `var` 自 JavaScript 問世以來就存在，其餘兩種皆是透過 ES6 釋出

在思考這三種宣告方式有什麼差異時，不斷問自己這個問題：

- 為什麼 ES6 要推出 `let` 、`const` ？
- `var` 在運作上有什麼瑕疵，以致於需要 `let` 和 `const` 來解決問題呢？

這樣更幫助我從根本更了解三者的差異及使用時機

<aside>
<img src="/icons/info-alternate_purple.svg" alt="/icons/info-alternate_purple.svg" width="40px" />

**小提示 / 補充知識**

什麼是 **ES6?**

- JavaScript 標準由 **ECMA** 統一管理，約每年會推出一次新的語法功能，此標準規範的正式名稱叫做 **ECMAScript（簡稱 ES）**
- **ES6**（也稱為 **ECMAScript 2015**）是 2015 年釋出的重大更新，帶來許多現代 JavaScript 的核心功能，例如：
let / const 變數宣告、箭頭函式（arrow functions）、樣板字面值 (template literal)、解構（destructure）、模組（ESModules）、class、Promise、展開 / 其餘運算子（rest / spread operator)…等
- ES6 推出功能之豐富、影響之深遠，大幅改善 JavaScript 開發體驗，使其至今仍被廣泛討論
</aside>

那麼以下說明 `var`、`let`、`const`有什麼差異：

### 可否重複宣告 / 重新賦值

- var
    - 可以重複宣告、重新賦值
- let
    - 不可以重複宣告、可以重新賦值
    - 實務上的用法：可以想成更現代的 `var` ，不可以重複宣告的特性，使 `let` 可以避免以往 `var` 容易被污染的狀況（開發者可能在無意間**重複宣告相同名稱的變數**，導致原本的值被覆蓋而沒注意到，多人開發中更容易無意間造成問題）
        
        ```jsx
        var message = "Hello";
        // ...中間一大段程式
        var message = "Overwrite Hello"; // 完全不會出錯，覆寫了而不自知
        ```
        
        ```jsx
        let count = 1;
        let count = 2; // ❌ SyntaxError: Identifier 'count' has already been declared
        ```
        
        使用 `let` 時一旦重複宣告變數，**程式會直接報錯**，讓開發者立刻發現問題，**而不是默默覆蓋值，造成更難追的 bug**
        
- const
    - 不可以重複宣告、重新賦值
    - 實務上的用法：`const` 宣告的值不能再改變，這樣的特性適合拿來宣告定值
        - 用一個日常的例子來說明 `const` 的用途的話，可以想成是，一週有七天，因此寫成
        
        ```jsx
        const daysInWeek = 7;
        ```
        
        這個規則是亙古不變的，所以適合用 const 來宣告
        
        另外 `const` 也增強易讀性，看到 `const`，就知道這是約定好不能動的值，之後不會也**不應該被重新賦值**
        
        ```jsx
        const name = "Alice";
        const name = "John"; // ❌ SyntaxError: Identifier 'name' has already been declared
        ```
        
        ```jsx
        const name = "Alice";
        name = "John"; // ❌ TypeError: Assignment to constant variable.
        ```
        


{% colorquote glossary %}
**詞彙解釋**

- **宣告 (declare)**：在程式中，**宣告**是指「告訴電腦我要使用一個變數或常數」，也就是先**保留一個記憶體空間**，讓這個名字（變數名稱）可以在之後被使用，此時變數的值可能還沒有指定
- **賦值 (assign)**：在程式語言中，除了「宣告 (declare)」也有「賦值 (assign)」 的說法，差別在於，宣告僅宣稱了這個變數的存在，而這個變數的內容與值是什麼，則是透過賦值來達成
{% endcolorquote %}


### 作用域 (Scope)

<aside>
<img src="/icons/book-closed_blue.svg" alt="/icons/book-closed_blue.svg" width="40px" />

**參考資料 / 延伸閱讀**

**什麼是作用域 (Scope)？以及提升(Hoisting)、遮蔽 (Shadowing)、Lexical Scope、TDZ、參數的傳遞方式** 

</aside>

#### var：全域、函式作用域

- 在全域宣告的 `var` ，其作用域即是整個全域
- 在函式中宣告的 `var` ，其作用域即是整個函式的範圍
    
    !codesnap2.png
    

換句話說，若 `var`在函式中宣告，但變數在函式外提及時，便無法查找到此變數

!image.png

```jsx
function getData() {
 var a = 0;
}

getData();

console.log(a); // Uncaught ReferenceError: a is not defined
```

<aside>
<img src="/icons/warning_yellow.svg" alt="/icons/warning_yellow.svg" width="40px" />

**注意**

在全域以 `var` 宣告的變數，會被新增為全域物件 (global object) 的屬性 (property) （`let`、`const` 則不會）

```jsx
var a = 123;
console.log(window.a); // 123

var b = 123;
console.log(window.b); // undefined

const c = 123;
console.log(window.c) // undefined
```

</aside>

<aside>
<img src="/icons/help-alternate_pink.svg" alt="/icons/help-alternate_pink.svg" width="40px" />

>**詞彙解釋**

>**全域物件 (global object)**：依環境而定，在瀏覽器環境是 `window` ；在 Node.js 環境是 `global`

</aside>

#### let、const：區塊作用域

所謂「區塊」指的是 `{}` 內的區域

例如：if, for loop, function 都包含區塊

<aside>
<img src="/icons/info-alternate_purple.svg" alt="/icons/info-alternate_purple.svg" width="40px" />

**小提示 / 補充知識**

**區塊作用域 (Block Scope)** ：JavaScript 在 ES6 前只有函式作用域 (Function Scope)，區塊作用域是在 ES6 推出 `let` 與 `const` 才產生的概念，而不像其他程式語言（C / C++ / Python) ，從一開始便有區塊作用域的概念

</aside>

```jsx
var str = "";

for (var i = 0; i < 3; i++) {
  str = str + i;
}

console.log(str);
console.log(i); // 3
```

```jsx
let str = "";

for (let j = 0; j < 3; j++) {
  str = str + j;
}

console.log(str);
console.log(j); // ReferenceError: Cannot access 'j' before initialization
```

### 提升(Hoist) 與變數初始值 (Initialize)

一個完整的變數宣告分為宣告 (declaration)、賦值 (assignment) 兩個部分

當 JavaScript 執行時，會經歷兩個主要的階段：**創造階段**（Creation Phase）和**執行階段**（Execution Phase）

- 創造階段時，宣告的部分 `var`、`let`、`const` 都會被提升 (Hoist) 到作用域最前方，留下賦值的部分在原位
- 執行階段時，才會執行變數的賦值

而在創造階段時（賦值前），變數則會先被賦予一個「初始值」：

- `var` 宣告的變數會自動被賦予初始值為 `undefined`
    - 因此在宣告前就使用 `var` 宣告的變數，會回傳 `undefined`
- `let` 與 `const` 宣告的變數則沒有初始值，並且在宣告前的區域會形成**暫時死區 (TDZ)**
    - 在 `let` 與 `const` 宣告變數前使用該變數，會出現錯誤：`ReferenceError: Cannot access before initialization`

```jsx
let x;
console.log(x); // Output: undefined
console.log(y); // ReferenceError: Cannot access 'y' before initialization 
let y;
```

```jsx
var x;
console.log(x); // Output: undefined
console.log(y); // Output: undefined
var y;
```

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

#### ReferenceError: Cannot access before initialization

- `let` / `const` 在宣告前執行，出現報錯 `ReferenceError: Cannot access before initialization`
    
    !image.png
    
    ```jsx
    name = "John";
    var name;
    // Output: John
    ```
    
    ```jsx
    name = "John";
    let name;
    // Output: ❌ Uncaught ReferenceError: Cannot access 'name' before initialization
    ```
    
- `var` 則是不會出現錯誤，僅回傳 `undefined`
    
    ```jsx
    console.log(x); // undefined
    var x = 5;
    
    console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
    let y = 10;
    
    console.log(z); // ❌ ReferenceError: Cannot access 'y' before initialization
    const z = 15;
    
    ```
    

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

<aside>
<img src="/icons/book-closed_blue.svg" alt="/icons/book-closed_blue.svg" width="40px" />

**參考資料 / 延伸閱讀**

**什麼是作用域 (Scope)？以及提升(Hoisting)、遮蔽 (Shadowing)、Lexical Scope、TDZ、參數的傳遞方式** work in progress…

</aside>

## 為什麼 ES6 要推出 let, const？

回到最初的這個題目：為什麼已有 var 處理變數宣告，ES6 還要推出 let, const？

總體而言 `let`、`const` 的特性做到了兩件事：

- 限縮可取得變數的範圍：Block Scope、TDZ
    
    縮小作用域使得不可控狀況較少出現
    
- 降低變數被誤改的可能性：不能任意重新宣告 / 賦值
    
    減少不必要的失誤以至於污染原本宣告的變數
    

簡單來說，`let` 和 `const` 的誕生，是為了解決 `var` 可能產生的問題，當專案規模大時，`let`、`const` 的使用可以減少非預期的錯誤

因此在現代的開發，多為使用 `let、const`，盡量避免使用 `var`

## 總結

|  | var | let | const |
| --- | --- | --- | --- |
| 作用域 (Scope) | 函式作用域 (Function Scope) | 區塊作用域 (Block Scope) | 區塊作用域 (Block Scope) |
| 重新宣告 | ✅ 可以重新宣告 | ❌ 不可以重新宣告
`SyntaxError: Identifier 'x' has already been declared` | ❌ 不可以重新宣告
`SyntaxError: Identifier 'x' has already been declared` |
| 重新賦值 | ✅ 可以重新賦值 | ✅ 可以重新賦值 | ❌ 不可以重新賦值
`TypeError: Assignment to constant variable` |
| 提升 (Hoist) | ✅ 會提升 | ✅ 會提升（但會進入 TDZ
`Reference Error: Cannot access before initialization` ） | ✅ 會提升（但會進入 TDZ
`Reference Error: Cannot access before initialization` ） |
| 初始值 (Initialization) | undefined | 無，賦值前無法取用 | 無，賦值前無法取用 |
| 語法推出年份 | ES3（1999） | ES6 (2015) | ES6 (2015) |

## 參考資料

https://www.freecodecamp.org/news/differences-between-var-let-const-javascript/#:~:text=var%20and%20let%20create%20variables,use%20let%20or%20const%20instead

https://realdennis.medium.com/%E6%87%B6%E4%BA%BA%E5%8C%85-javascript%E4%B8%AD-%E4%BD%BF%E7%94%A8let%E5%8F%96%E4%BB%A3var%E7%9A%843%E5%80%8B%E7%90%86%E7%94%B1-f11429793fcc

https://www.explainthis.io/zh-hant/swe/js-var-let-const-in-javascript

*《帶你無痛提升 JavaScript 面試力》Ch 1 變數與作用域*