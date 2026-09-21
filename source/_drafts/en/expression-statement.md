---
title: Expression vs Statement, Function Statement vs Function Expression
date: 2025-04-17 23:03:16
categories: Technology
tags:
---

## What are expression and statement?

 The syntax of JavaScript (and most programming languages) can be categorized into two types depending on whether or not it returns a value: expressions and statements.

- Expressions
    - Returns a result
    - Example:
        - Execute function
        - Pure values
        - Variable
        - Operator
        - Function expressions
        
         (see MDN for a complete list)
        
<!-- more -->

- statement
    - does not return results
    - Example:
        - Variable declarations `var`, `let`, `const`
        - Flow control ( `if...else`, `switch`, `for loop`, `try...catch` )
        - import / export
        
         (see MDN for a complete list)
        

 To see if a value is returned, you can throw a piece of code into a console and see if a value is returned.

 expression will see the value returned.
![](./images/expression-console.png)

 statement does not return values, so you will only see console return `undefined`. 
![](./images/statement-console.png)

{% colorquote info %}
**Reference / Extended Reading**

看似基礎但把新手搞暈頭的 console.log vs return 印出值？回傳值？*(work in progress)*...
{% endcolorquote %}

 For more on the difference between expression and statement, see some of the MDN and Wikipedia descriptions:

- *"Statements are executed, and expressions are evaluated." ; "Statements perform an action; expressions Statements perform an action; expressions produce a value." Statements are code that performs an action, and expressions are code that returns (produces) a value.*
- *"Statement have no value (it's an instruction)." Statement has no value (it's an instruction)." Statement itself has no value, it's just an instruction*
- *"Statement is a group of keywords." Statement is a combination of keywords.*
- *"It (expression) is a combination of one or more constants, variables, functions, and operators that the programming language interprets and computes to produce another value. expression is a combination of one or more constants, variables, functions, and operators that the programming language interprets and computes to produce another value.*
- *"An expression is a syntactic entity in a programming language that may be evaluated to determine its value. expression is a syntactic entity in a programming language that may be evaluated to determine its value.*
- *"A statement can consist of little more than an expression" A statement can consist of many expressions.*

 A statement can contain more than one expression:

- Statement Functions to describe a process.
- Expression generates (returns) a value.
- A Statement can contain more than one Expression and use its returned values to execute a process.

### Why is it important to understand the difference between an expression and a statement?

 Expressions and statements perform different functions: a statement is a process control framework that must wrap expressions to produce results.

 Just as learning a language requires knowledge of grammatical structure, it also requires knowledge of words in order to speak;

 Just as you need to know how to operate a weapon, you need to know how to insert a bullet in order to fire it - the two complement each other!

 If you know which syntax is an expression, you know how the code fits together.

 This will help you read the technical documentation and put syntactically correct code in the right place.

 For example, `if... .else` If you understand the expression, you can understand that the if condition must be an expression that returns a value to avoid writing a `SyntaxError`.

![](./images/if-else-condition-mdn.png)

![](./images/if-else-syntax-error-statement.png)

 e.g. `Boolean()`

![](./images/if-else-syntax-error-primitive-wrapper-object.png)

For example, `JSX` 

 You can see why JSX inserts a `ternary operator` instead of writing `if...` else when making a conditional judgment. `. else` 

 Because the former is an expression that can return a value and the latter is a statement that cannot return a value.

```jsx
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```
[https://react.dev/learn/conditional-rendering#conditional-ternary-operator--](https://react.dev/learn/conditional-rendering#conditional-ternary-operator--)

## Function Expressions and Function Statements

 Talking about expressions and statements brings up this often-discussed topic: Functional Expressions and Functional Statements.

 In my experience with JavaScript, I consider functions to be the most special of all.

> " *To use the language well, it is important to understand that functions are values.*
> 

 For beginners, functions may seem like a flow control paragraph at first.

 But to become proficient in JavaScript, it's important to understand that a function is also an object.

 (I'll write a few more articles about objects and first-class functions later.

{% colorquote info %}
**References / Extended Reading**

 Function object: *{% post_link en/type-conversion-truthy-and-falsy Data Type - Type Conversion and Comparison, True and False Values %}*

 First-class function: **函式：一級函式、高階函式、回呼函式** *(work in progress)*...
{% endcolorquote %}

 The next point is the difference between a function expression and a function statement. Let's start with the basic syntax structure:

 Function statement:

```jsx
function greet() {
  console.log("Hello!");
}

greet();
```

 Functional expressions:

```jsx
const greet = function() {
  console.log("Hello!");
};

greet();
```

 Functional expressions appear to store a function in a variable, and are called by the name of the variable.

 The first difference to mention is the "lifting" of the receiver.

### Boosting

 Function expressions: complete lifting

```jsx
// 創造階段
function greet() {
  console.log("Hello!");
}

// 執行階段
greet();
```

 Functional expressions: the part of the variable that is declared is lifted.

```jsx
// 創造階段
const greet

// 執行階段
greet = function() {
  console.log("Hello!");
};

greet();
```

 Due to this feature, a function expression cannot be called until it reaches the value of the given paragraph.

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
**Reference / Extended Reading**

*{% post_link en/scope-hoist-shadowing What is Scope? Hoisting, Shadowing, Lexical Scope, TDZ, Parameter Passing %}*
{% endcolorquote %}

### Named vs Anonymous

- Functional expressions: Usually anonymous, not very likely to be anonymous, so you can probably tell it's a functional expression when you see anonymity.
- Function expression: can be anonymous, can be anonymous, anonymous is used for internal call.
    
     Example: Named Function Expression
    
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
    

### Scenarios where function expressions are used

 Functions are often used where values need to be returned, e.g. after a variable declaration, or within a conditional.

 Functional expressions are often used when you need to pass a function dynamically or embed a function within a function, to name a few common examples:

- **Callbacks**: Functions such as event handlers and `setTimeout` that need to be defined in real time without raising them.
- **anonymous functions**: when a function needs to be called only once, somewhere, and does not need to be named independently.
- **Closure**: Used in the context of establishing scope and preserving state, such as variable holding in loops.
- **Immediate Functions (IIFE) and Modularization**

{% colorquote info %}
**Reference / Extended Reading**

函式：封裝（好的封裝）、閉包 Counter II *(work in progress)*...
{% endcolorquote %}

 One final note:

 Arrow Functions have only the expression form, not the declarative method.

 (Read MDN to find out that Arrow Function is a shortened form of "function expression", not the syntactic sugar that all functions are written in.

![](./images/expression-arrow-function.png)

{% colorquote info %}
**References / Extended Reading**

**函式：一級函式、高階函式、回呼函式** *(work in progress)*...

箭頭函式的引用原因、使用時機
{% endcolorquote %}

## Conclusion

|  |  expression |  statement |
| --- | --- | --- |
|  ✅ Returns a value |  ✅ Return Value |  ❌ Does not return values |
|  Function |  Process Control |  Calculates the value |
|  Syntax |  - Execute Functions - Pure Values - Variables - Operators - Function Expressions (see MDN for a complete list) |  - Variable declaration `var`, `let`, `const` - Process control ( `if...else`, `switch`, `for loop`, `try...catch` ) - import / export (see MDN for a complete list) |

|  |  function statement |  function expression |
| --- | --- | --- |
|  Syntax structure | `function greet() {}` | `const greet = function() {}` |
|  Attributes |  statement |  expression |
|  Elevation |  Full elevation, can be called anywhere |  only partial elevation of a variable declaration, can only be called after the declaration of a function |
|  Named / Anonymous |  Named |  Named / Anonymous |
|  Usage Scenarios |  Functional expressions can be used in all cases except those where they are applicable. |  Where you need to send back values or closures, or use it as a callback or anonymous function. |

## References

- https://en.wikipedia.org/wiki/Statement_(computer_science)
- https://en.wikipedia.org/wiki/Expression_(computer_science)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function
- https://react.dev/learn/conditional-rendering#conditional-ternary-operator--
- Ch2 *of "Improve Your JavaScript Interviewing Skills Painlessly"*.