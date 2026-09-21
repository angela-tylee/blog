---
title: 表達式 (Expression) vs 陳述式 (Statement)、函式陳述式 vs 函式表達式
categories: Technology
date: 2025-04-17 23:03:16
created: 2025-04-17 23:03:16
tags:
---


{% colorquote appendix %}
學習重點：

- 表達式 (expression) 和陳述式 (statement) 是什麼，如何區分？
- 函式表達式 (function expression) 和函式陳述式 (function statement) 是什麼？用途有什麼差異？
{% endcolorquote %}


## 表達式與陳述式是什麼？

JavaScript （以及大部分的程式語言）的語法可依據是否回傳值分為兩種：表達式、陳述式

- 表達式 (expression)
    - 會回傳結果
    - 例如：
        - 執行函式
        - 純值
        - 變數
        - 運算子
        - 函式表達式
        
        （完整清單可參考 MDN）
        
<!-- more -->

- 陳述式 (statement)
    - 不會回傳結果
    - 例如：
        - 變數宣告 `var`、`let`、`const`
        - 流程控制（`if…else`, `switch`, `for loop`, `try…catch`)
        - import / export
        
        （完整清單可參考 MDN）
        

所謂是否會回傳值，可以將一段程式碼丟進 console 中，看看是否有值回傳

表達式 (expression) 會看到值回傳
![](./images/expression-console.png)

陳述式 (statement) 則沒有回傳值，所以只會看到 console 回傳 `undefined` 
![](./images/statement-console.png)

{% colorquote info %}
**參考資料 / 延伸閱讀**

看似基礎但把新手搞暈頭的 console.log vs return 印出值？回傳值？*(work in progress)*...
{% endcolorquote %}

關於表達式 (expression) 和陳述式 (statement) 的差異再看一些 MDN 和 Wikipedia 上的敘述：

- *“Statement are executed, and expressions are evaluated.” ; “Statements perform an action; expressions produce a value.” 
陳述式是用來執行動作的程式碼，而表達式是會回傳（產生）一個值的程式碼*
- *“Statement have no value (it’s an instruction).”
陳述式本身沒有值，它只是一個指令*
- *“Statement is a group of keywords.”
陳述式是由多個關鍵字組合而成的語句*
- *“It (expression) is a combination of one or more constants, variables, functions, and operators that the programming language interprets and computes to produce another value.”
表達式是由一個或多個常數、變數、函式和運算子所組成的組合，程式語言會對其進行編譯與計算，進而產生另一個值*
- *“An expression is a syntactic entity in a programming language that may be evaluated to determine its value.”
在程式語言中，表達式是一種可以產生值的語法結構*
- *“A statement can consist of little more than an expression” 
一個陳述式可以包含多個表達式*

綜上所述：

- 陳述式 (Statement) 功能為描述一段流程
- 表達式 (Expression) 功能則為產生（回傳）值
- 陳述式 (Statement) 可包含多個表達式 (Expression) ，並使用其回傳值執行流程

### 為什麼要了解表達式與陳述式的差異？

表達式 (expression) 與陳述式 (statement) 司職不同的功能：陳述式是一段流程控制的架構，裡面必須包裹表達式，才能產生出結果

就像學習語言要懂得文法結構、也要懂得單字，才說得出話；

就像使用武器要懂得操作、也要塞進子彈，才能發射一樣，兩者相輔相乘

如果你了解哪些語法屬於表達式，便等於了解程式碼之間應該如何拼湊才能運作

這能幫助你讀懂技術文件，在正確的段落放入符合語法的程式碼

例如 `if...else` 
在讀懂 expression 的前提下，便可以了解 if 的條件必須是可以回傳值的表達式，避免寫出 `SyntaxError`

![](./images/if-else-condition-mdn.png)

![](./images/if-else-syntax-error-statement.png)

例如 `Boolean()`

![](./images/if-else-syntax-error-primitive-wrapper-object.png)

例如 `JSX` 

你可以懂得為什麼 JSX 在做條件判斷的時候要插入 `ternary operator` （三元運算子），而不是直接寫 `if...else` 

因為前者是表達式可以回傳值，後者是陳述式無法回傳值

```jsx
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```
[https://react.dev/learn/conditional-rendering#conditional-ternary-operator--](https://react.dev/learn/conditional-rendering#conditional-ternary-operator--)

## 函式表達式與函式陳述式

談論表達式及陳述式不免提到這個常常被討論的題目：函式表達式與函式陳述式

在我的 JavaScript 學習歷程中，我認為函式是最特別的存在

> *“To use the language well, it is important to understand that functions are values.”* - 《JavaScript: The Good Part》
> 

對於初學者來說，一開始函式看起來只像是個流程控制的段落

但是若要精通 JavaScript 就必須了解，函式同時也是一個物件

（後面會再寫幾篇與物件和一級函式 (first-class function) 相關的內容）

{% colorquote info %}
**參考資料 / 延伸閱讀**

函式物件：*{% post_link zh-tw/type-coversion-truthy-and-falsy 型別：型別的轉換 (Type Conversion) 與比較、真假值 $}*

一級函式 (first-class function)：**函式：一級函式、高階函式、回呼函式** *(work in progress)*...
{% endcolorquote %}

接下來就帶到函式表達式與函式陳述式的不同，先從基本語法結構來看：

函式陳述式：

```jsx
function greet() {
  console.log("Hello!");
}

greet();
```

函式表達式：

```jsx
const greet = function() {
  console.log("Hello!");
};

greet();
```

函式表達式看起來是把函式存在一個變數中，而呼叫時也是用變數的名字呼叫

接者首先要提到的不同處在於「提升」

### 提升

函式陳述式：完整提升

```jsx
// 創造階段
function greet() {
  console.log("Hello!");
}

// 執行階段
greet();
```

函式表達式：變數宣告的部分被提升

```jsx
// 創造階段
const greet

// 執行階段
greet = function() {
  console.log("Hello!");
};

greet();
```

基於這樣的特點，函式表達式在執行到賦值的段落前不能呼叫

{% colorquote glossary %}
**詞彙解釋**

- **創造階段 (creation)：**
    - **建立變數與函數**：，JavaScript 會將宣告的變數及函數載入到記憶體中
    - **提升（Hoisting）**：變數宣告、函數宣告、函式陳述式會被「提升」到作用域的頂部（`var` 宣告的變數會被創建並初始化為 `undefined`）
    - 確認作用域範圍（語法作用域）
    - 完成閉包記憶體留存
- **執行階段 (execution)：**
    - **執行變數賦值**：在這個階段，賦值段落會被執行，變數會被賦予實際的值。
    - **執行函數呼叫**：函數會在執行階段運行
{% endcolorquote %}

{% colorquote info %}
**參考資料 / 延伸閱讀**

*{% post_link zh-tw/scope-hoist-shadowing 什麼是作用域 (Scope)？以及提升(Hoisting)、遮蔽 (Shadowing)、Lexical Scope、TDZ、參數的傳遞方式 %}*
{% endcolorquote %}

### 具名 vs 匿名

- 函式陳述式：通常具名，不太會有匿名狀況出現，因此看到匿名大概就可判斷為函式表達式
- 函式表達式：可匿名、可具名，具名時是使用於函式內部呼叫
    
    範例：具名函式表達式
    
    ```jsx
    const greet = function hello() {
      console.log("Hello!");
    };
    
    greet(); // 正常呼叫
    hello(); // 錯誤，因為 'hello' 是具名函式的名稱，無法在外部訪問
    ```
    
    ```jsx
    const factorial = function fact(n) {
      if (n <= 1) return 1;
      return n * fact(n - 1); // 使用具名函式來遞迴
    };
    
    console.log(factorial(5)); // 輸出: 120
    
    ```
    

### 函式表達式的使用場景

需要回傳值的地方通常就是函式表達式，例如變數宣告後、或是條件式內

而函式表達式通常用於需要動態傳遞函式或在函式內嵌入函式的場合，舉幾個常見的例子：

- **回呼函式（callback）**：如事件處理程序和`setTimeout`等，需要即時定義不會提升的函式。
- **匿名函式**：當函式僅需在某處被一次性調用，且不需要獨立命名。
- **閉包（closure）**：用於建立作用域和保存狀態的情境，如迴圈內的變數保持。
- **立即函式 (IIFE) 與模組化**

{% colorquote info %}
**參考資料 / 延伸閱讀**

函式：封裝（好的封裝）、閉包 Counter II *(work in progress)*...
{% endcolorquote %}

最後補充一點：

箭頭函式 (Arrow Function) 僅有表達式的形式，沒有陳述式的宣告方法

（翻閱 MDN 就會發現箭頭函式本來就是 “function expression”（函式表達式）的簡略寫法，而不是所有函式寫法的語法糖）

![](./images/expression-arrow-function.png)

{% colorquote info %}
**參考資料 / 延伸閱讀**

**函式：一級函式、高階函式、回呼函式** *(work in progress)*...

箭頭函式的引用原因、使用時機
{% endcolorquote %}

## 總結

|  | 表達式 (expression) | 陳述式 (statement) |
| --- | --- | --- |
| 是否回傳值 | ✅ 會回傳值 | ❌ 不會回傳值 |
| 功能 | 流程控制 | 計算出值 |
| 語法 | • 執行函式<br>• 純值<br>• 變數<br>• 運算子<br>• 函式表達式<br>（完整清單參考 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)） | • 變數宣告 `var`、`let`、`const`<br>• 流程控制（`if…else`, `switch`, `for loop`, `try…catch`) <br>• import / export<br>（完整清單可參考 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements)） |

|  | 函式陳述式 (function statement) | 函式表達式 (function expression) |
| --- | --- | --- |
| 語法結構 | `function greet() {}` | `const greet = function() {}` |
| 屬性 | 陳述式 (statement) | 表達式 (expression) |
| 提升 | 全部提升，可以在任何地方呼叫 | 僅變數宣告部分提升，只能在函式宣告後呼叫 |
| 具名 / 匿名 | 具名 | 具名 / 匿名皆可 |
| 使用場景 | 除函式表達式適用的場景外，都可以使用函式陳述式 | 需要回傳值或閉包的地方，以及作為回呼、匿名函式使用 |

## 參考資料

- https://en.wikipedia.org/wiki/Statement_(computer_science)
- https://en.wikipedia.org/wiki/Expression_(computer_science)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function
- https://react.dev/learn/conditional-rendering#conditional-ternary-operator--
- 《帶你無痛提升 JavaScript 面試力》Ch2