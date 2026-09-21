---
title: What is Scope? Hoisting, Shadowing, Lexical Scope, TDZ, Parameter Passing
date: 2025-04-16 14:29:00
categories: Technology
tags:
---

Let's start with some contextual questions:

 (From Hexagon Kasper's book, "How to Improve Your JavaScript Interviewing Skills Without Pain")

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

 Do you have the answers in your mind? If you still have questions, it means you don't have any knowledge about scoping, lifting, masking, syntactic scoping, etc. You can read on!

 The question I ask myself here is:

 "How do I make sure that JavaScript fetches the correct variable/function when executing a program? Where should I declare variables/functions when I declare them?

## Scope

 Let's look at a couple of statements about scope:

> *"The **scope** is the current context of execution in which values and expressions are "visible" or can be referenced. expression is not in the current scope, it will not be available for use."* - MDN Web Docs
> 

> *If a variable or expression is not in the current scope, it will not be available for use." - MDN Web Docs "JavaScript does have function scope. That means that the parameters and variables defined in a function are not visible outside of the function. That means that the parameters and variables defined in a function are not visible outside of the function." - JavaScript: The Good Parts*
> 

 This means that the parameters and variables defined in a function are not visible outside of the function.

 Therefore, knowing the scope is the same as knowing **where** the variables can be accessed after being declared.

### Scope of JavaScript

- Global Scope
- Function Scope: the variable declared by `var`.
- Block Scope: `let`, `const` declared variables

Function Scope:
![](./images/function-scope.png)

Block Scope:

![](./images/block-scope.png)
![](./images/block-scope-for-loop.png)

{% colorquote tips %}
**Tips / Additional Knowledge**

 Before ES6, JavaScript's reliance on global variables and function scopes has been a major complaint.

 With the introduction of let and const in ES6, block scope was introduced to solve the problem of large variable scopes.
{% endcolorquote %}

 Example:

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

### Why do we need scopes?

 Why limit the scope of variables that can be used, and why make a bunch of counter-intuitive errors?

 The purpose and benefits of scopes:

- Improve code maintainability and modularity.
    - Variables in different scopes are independent and will not generate name conflicts.
    - Avoid accidental modification or overwriting of declared variables.
- Helps memory management, when the use of a scope has ended (and it is not being used by a closure), the memory occupied by the variables inside it will be released.

{% colorquote info %}
**Extended reading**

 Closing: 函式：封裝（好的封裝）、閉包 Counter II *(work in progress)*...
{% endcolorquote %}

## Hoisting

 JavaScript doesn't have a fixed area for variable declaration, you can declare variables anywhere!

 However, when JavaScript executes code, it rearranges the order of the code, and **moves the code of a particular section to the top of the scope**.

 This reorganization is called "Hoisting".

 The hoisted code is:

- **Variable declarations** (except those that are value-enabled)
    - `var` is hoisted to the top of the scope or function scope.
    - `let, const` are hoisted to the front of the block scope.
- **Function Declarations**

{% colorquote warning %}
**Note that**

 Only the declaration part of a variable is promoted, the assignment paragraph stays in place.

![](./images/variable-declaration-assignment.png)

 Example:

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
{% endcolorquote %}

 Example: Elevation of a variable declaration

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

 Example: Elevation of a functional statement

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

{% colorquote info %}
**Extended Reading**

*{% post_link en/var-let-const-difference Variable declaration and the difference between var, let, const %}*

*{% post_link en/expression-statement Expression vs Statement, Function Statement vs Function Expression %}*
{% endcolorquote %}

 See the Udacity explanatory video for a clear visual demonstration:

<!-- {% iframe https://www.youtube.com/embed/8z-HSS34dsM 600 400 %} -->
<iframe src="https://www.youtube.com/embed/8z-HSS34dsM" frameborder="0" width="400" height="300" allowfullscreen></iframe>

### Why is it important to have a lifted design?

- The purpose of enhancement:
    - Establishing the location of variables and functions in memory (registering the names of variables and functions in memory) during **the creation phase of** JavaScript.
    - These behaviors are designed to allow the JavaScript engine to quickly know during **execution**: where the variable is, which scope it belongs to, and whether it has been declared.

- The following are some of the benefits that come with enhancements:
    - Increased writing flexibility → reduced mental burden, more efficient development
        - Can be used before declaring, developers can focus more on the logical flow, do not have to worry too much about the declaration order, so that the development is more efficient.
    - Improve readability and maintainability → declarations can be centrally managed for easy maintenance.
        - Function or variable declarations can be centrally managed, making the overall structure clearer and facilitating future maintenance and expansion.
        - **Main procedures** can be **written in the front and detailed functions can be concentrated in the back**, realizing the writing mode of "read the outline first, then read the details", which is conducive to the structuring and maintenance of the code.
    - Reduces the difficulty of entry-level writing → Even if you don't fully understand the execution sequence, you can still write executable code, which is helpful for beginners to get started.

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

## Shadowing

 Let's come back to a situation: if there are variables (or parameters) with the same name in both child and parent layers, which one will be used first?

 The answer is: look outwards (to the parent) and prioritize the closest variable!

*"Scopes can also be layered in a hierarchy, so that child scopes have access to parent scopes, but not vice versa."* - MDN Web Docs

 From the perspective of the outer layer, if there is already a variable with the same name in the inner layer, it is not possible to access the outer layer's variables, as if they are "masked" by the inner layer's variables.

 Example:

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

 See the Udacity video:

 Source: [Intro to JavaScript | Udacity](https://youtu.be/NMLG2PQ6RRM)

 Source: Intro to JavaScript | Udacity

### Variables vs Parameters: Parameter Delivery Methods

```jsx
let name = 'John';

function greet(name) {
  console.log('Hello, ' + name);
}

greet('Alice');  // 印出 'Hello, Alice'，有參數時優先使用參數
greet(name);     // 印出 'Hello, John'，同名參數時向外查找到 'John'
greet();         // 印出 'Hello, undefined’，參數預設值為 `undefined`
```

## Lexical Scope

 Let's look at the question, which value of `myName` will be taken by `fn1()`?

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

 The reason is "Lexical Scope": in JavaScript, **variable lookups are always based on where the function is defined, not where it is called**!

 Therefore, `fn1` determines the scope and the variable to be fetched at the time of writing, and is not affected by the environment in which the call is made.

 Lexical Scope is a syntactic feature of most modern programming languages, and one of the major syntactic advantages of JavaScript.

 Syntactic scopes make programs more predictable, and it is easier to see how they will run when they are written.

{% colorquote tips %}
**Tips / Additional Knowledge**

 Lexical Scope is also known as Static Scope, as opposed to Dynamic Scope.

 A language with a Dynamic Scope is a scope that determines variables **when a function is called**.

|  Characteristics |  Lexical Scope |  Dynamic Scope |
| --- | --- | --- |
|  Variable parsing method |  Based on code structure |  Call stack according to execution phase |
|  Languages used |  JavaScript, Python, Java, C, Rust, etc. |  LaTeX and the shell languages bash, dash |
{% endcolorquote %}

## TDZ (Temporal Dead Zone)

 Temporal Dead Zone only applies to `let`, `const` declared variables.

{% colorquote info %}
**References / Extended Reading**

*{% post_link en/var-let-const-difference Variable declaration and the difference between var, let, const %}*

{% endcolorquote %}

{% colorquote glossary %}
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
{% endcolorquote %}

## Conclusion

- Scope:
    - Limit the scope in which a variable can be used
    - 3 types of scopes:
        - Full Scope
        - Function scopes
        - Block scopes
- Hoist:
    - During the JavaScript creation phase, variables/functions are moved to the top of the scope.
    - The purpose is to register memory locations for smooth execution during the execution phase.
    - Hoisted paragraphs:
        - Variable declaration
        - Function declarations
- Shadow:
    - The order of searching variables: from inside to outside.
    - If there are several variables and parameters with the same name, the one closest to the function declaration is preferred.
- Lexical Scope.
    - The scope of a piece of code is determined when the program is written (creation phase) and will not be changed during execution.
- TDZ (Temporal Dead Zone).
    - From the top of the scope to the place where `let` and `const` variables are declared, they are all temporary dead zones.
    - Variables cannot be accessed within the TDZ.

## Afterthought

 In the process of searching for information, I was reminded that I have learned a lot of tools and underlying logic along the way, from the time I first got into programming.

 At first, I found these rules cumbersome and redundant, but gradually I realized that any rule usually has a problem it is trying to solve.

 Once I became familiar with the rules, they worked for me and made my development process much easier.

 Most tools and specifications have strengths and weaknesses that come with them, and I'm sure the same is true of JavaScript's compilation logic.

 Good engineers never give up on finding better solutions, which is why new syntax features and tools are constantly being introduced, and I think that's why engineers need to keep learning!

 When I feel tired and confused, I try to look up the problems that these technologies are trying to solve, so I have the motivation to get through the stage of understanding unfamiliar concepts, and then enjoy a more enjoyable development experience!

 I'd like to share my thoughts and encouragement with you.

## References

- https://www.w3schools.com/js//js_scope.asp
- https://developer.mozilla.org/en-US/docs/Glossary/Scope
- https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz
- https://www.udacity.com/enrollment/ud803
- *Ch 1 Variables and Scopes in the Painless JavaScript Interviewing Power Guide*
- https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scope
- https://www.geeksforgeeks.org/static-and-dynamic-scoping/