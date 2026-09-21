---
title: Variable declaration and the difference between var, let, const
date: 2025-04-13 11:00:00
categories: Technology
tags: ['javascript', 'beginner']
---

The first article is dedicated to the basics of the basics: variable declaration and the difference between var, let, and const.

## What is "declaration" of variables?

 Declaring a variable, to me as a beginner, is like naming a value:

 This 28 year old, 180cm tall man is named John.

<!-- more -->

```jsx
let John = {
	age: 28,
	height: 180,
	gender: male
}
```

 In another, more precise sense, it's "storing" a value or a piece of code back.

 This value can be a string, a number, or an object.

 For example, it can be a string, a number, or an object:


```jsx
const res = await fetch(url);
```

{% colorquote glossary %}
**Glossary**

What is meant by "return"?

看似基礎但把新手搞暈頭的 console.log vs return 印出值？回傳值？ work in progress...
{% endcolorquote %}

 Since DRY (Do not repeat yourself) is a very basic principle when writing code, storing values in variables is pretty much the way to start writing JavaScript!

 With variables, we can manipulate a potentially large and changing piece of data by using a simple name.

## Three ways to declare variables: var, let, const

 There are three ways to declare variables in JavaScript: var, let, and const.

 With the exception of `var`, which has been around since the beginning of JavaScript, the other two were released through ES6.

 When thinking about the differences between these three ways of declaring variables, I kept asking myself this question:

- Why did ES6 introduce `let` and `const`?
- What's so flawed about `var` that it needs `let` and `const` to solve its problems?

 This helps me to understand the differences between the three and when to use them.

{% colorquote tips %}
**Tips / Additional Knowledge**

 What is **ES6?**

- The JavaScript standard is managed centrally by **the ECMA**, and new syntax features are released about once a year. The official name of this standard specification is **ECMAScript (or ES for short)**.
- **ES6** (also known as **ECMAScript 2015** ) is a major update released in 2015 that brings many of the core features of modern JavaScript, such as: let / const variable declarations, arrow functions, template literals, destructures, modules, and more. destructure, ESModules, class, Promise, rest/spread operator... etc.
- ES6 is still widely discussed today because of its richness of functionality and far-reaching impact on improving the JavaScript development experience.
{% endcolorquote %}

 So here are the differences between `var`, `let`, and `const`:

### Declared / Re-assigned repeatedly

- var
    - Can be redeclared and reassigned
- let
    - cannot be declared repeatedly and can be reassigned.
    - Practical Usage: Think of it as a more modern `var`. The feature of not being able to repeat declarations allows `let` to avoid the pollution that `vars` used to be susceptible to (developers may inadvertently **repeat declarations of variables with the same name**, resulting in the original value being overwritten without noticing it, which is more likely to inadvertently cause problems in multiplayer development).
        
        ```jsx
        var message = "Hello";
        // ...中間一大段程式
        var message = "Overwrite Hello"; // 完全不會出錯，覆寫了而不自知
        ```
        
        ```jsx
        let count = 1;
        let count = 2; // ❌ SyntaxError: Identifier 'count' has already been declared
        ```
        
         When `let`  is used, **the program will report an error** if the variable is declared repeatedly, so that the developer can find the problem immediately, **instead of overwriting the value silently, which will result in more difficult bugs to track down**.
        
- const
    - Cannot be declared or re-assigned repeatedly.
    - Practical use: `const` can't be changed, so it's a good choice for declaring fixed values.
        - To illustrate the use of `const` with an everyday example, think of it as a seven-day week, so write
        
        ```jsx
        const daysInWeek = 7;
        ```
        
         This rule is unchanging, so it is appropriate to use const to declare it.
        
         In addition, `const` also enhances readability. When you see `a const`, you know that it is a value that has been contracted not to be moved, and that it will not and **should not be reassigned** later.
        
        ```jsx
        const name = "Alice";
        const name = "John"; // ❌ SyntaxError: Identifier 'name' has already been declared
        ```
        
        ```jsx
        const name = "Alice";
        name = "John"; // ❌ TypeError: Assignment to constant variable.
        ```
        

{% colorquote glossary %}
**Glossary**

- **declare:** In programming, **declare** means to "tell the computer that I want to use a variable or constant", i.e., **to reserve a memory space** so that the name of the variable can be used later, when the value of the variable may not have been specified yet.
- **assign:** In program language, besides "declare", there is also "assign", the difference is that declare only declares the existence of the variable, and what the content and value of the variable are is achieved by assigning the value.
{% endcolorquote %}

### Scope

{% colorquote info %}
**Reference / Extended Reading**

**什麼是作用域 (Scope)？以及提升(Hoisting)、遮蔽 (Shadowing)、Lexical Scope、TDZ、參數的傳遞方式**
{% endcolorquote %}

#### var: Full Scope, Function Scope

- A `var` declared in the global scope is scoped to the entire global scope.
- The scope of a `var` declared in a function is the entire scope of the function.
    
    ![](./images/function-scope.png)
    

 In other words, if `var` is declared in a function, but the variable is mentioned outside the function, then it cannot be found.

![](./images/is-not-defined.png)

```jsx
function getData() {
 var a = 0;
}

getData();

console.log(a); // Uncaught ReferenceError: a is not defined
```

{% colorquote warning %}
**Note that**

 A variable declared as `var` in the global scope is added as a property of the global object  ( `let`, `const` are not).

```jsx
var a = 123;
console.log(window.a); // 123

var b = 123;
console.log(window.b); // undefined

const c = 123;
console.log(window.c) // undefined
```
{% endcolorquote %}

{% colorquote glossary %}
**Glossary**

**global object:** depends on the environment, `window` in a browser environment, `global in` a Node.js environment.
{% endcolorquote %}

#### let, const: block scope

 The term "block" refers to the area within `{}`.

 For example: if, for loop, function all contain blocks.

![](./images/block-scope.png)
![](./images/block-scope-for-loop.png)

{% colorquote tips %}
**Tips / Supplementary Knowledge**

**Block Scope**: JavaScript only had Function Scope before ES6, the concept of Block Scope was introduced in ES6 with the introduction of `let` and `const`, unlike other programming languages (C / C++ / Python) where the concept of Block Scope has been around since the beginning.
{% endcolorquote %}

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

### Hoist and Initialize

 A complete declaration of a variable is divided into two parts: declaration and assignment.

![](./images/variable-declaration-assignment.png)

 When JavaScript is executed, it goes through two main phases: **Creation** Phase and **Execution** Phase.

- During the Creation Phase, the declarations `var`, `let`, and `const` are hoisted to the front of the scope, leaving the assignments in place.
- During Execution Phase, only the enumeration of the variables is executed.

 During the creation phase (before the assignment), variables are given an "initial value":

- A variable declared by `var` is automatically assigned an initial value of `undefined`.
    - Therefore, variables declared by `var` before being declared are returned as `undefined`.
- variables declared by `let` and `const` have no initial value and are **temporarily dead zones (TDZ)** in the area before they are declared.
    - Using a `let` or `const` declared variable before it is declared will result in an error: `ReferenceError: Cannot access before initialization`

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

{% colorquote glossary %}
**Glossary**

- **Creation:**
    - **Creating global variables and functions**: JavaScript loads variables or functions into memory if they are declared in global scopes.
    - **Hoisting**: variable declarations and function declarations are "hoisted" to the top of the scope, and the variable is created and initialized to `undefined`.
- **Execution:**
    - **Execute variable assignment**: In this phase, the assignment paragraph is executed and the variable is given its actual value.
    - **Execute function call**: The actual code of the function is run during the execution phase.
{% endcolorquote %}

#### ReferenceError: Cannot access before initialization

- `let` / `const` is executed before initialization, an error occurs `ReferenceError: Cannot access before initialization`
    
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
    
- `var` returns `undefined` without an error.
    
    ```jsx
    console.log(x); // undefined
    var x = 5;
    
    console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
    let y = 10;
    
    console.log(z); // ❌ ReferenceError: Cannot access 'y' before initialization
    const z = 15;
    
    ```
    

{% colorquote glossary %}
**Glossary**

**TDZ (Temporary Dead Zone) A temporary dead zone:**

 The area from the beginning of the scope to the point where the variable is declared, where the variable cannot be accessed.

**Between** the time you use `let` or `const` to declare a variable and the time it is not **initialized**, the variable exists but cannot be accessed, or an error will be thrown.

```jsx
{
  // TDZ starts at beginning of scope
  console.log(bar); // "undefined"
  console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
  var bar = 1;
  let foo = 2; // End of TDZ (for foo)
}
```

 In the example below, using a `var` declaration (without TDZ), count is fetched before count is initialized, so you don't get the correct value, but you don't get an error, and it's not easy for the developer to see that an error has occurred here

```jsx
if (!count) {
  console.log(count); // undefined
}
var count = 1;
```

 If you use a `let` declaration to access count before initialization, it is the same as accessing the value in TZD, and you get an error `Reference Error: Cannot access 'counts' before initialization`

```jsx
// start of TDZ
if (!count) {
  console.log(count); // ❌ Reference Error: Cannot access 'counts' before initialization
}
let count = 1; // end of TDZ
```
{% endcolorquote %}

{% colorquote info %}
**Reference / Extended Reading**

**什麼是作用域 (Scope)？以及提升(Hoisting)、遮蔽 (Shadowing)、Lexical Scope、TDZ、參數的傳遞方式** work in progress...
{% endcolorquote %}

## Why did ES6 introduce let, const?

 Back to the original question: why did ES6 introduce let, const when var already handles variable declarations?

 In general, the properties of `let` and `const` do two things:

- Limit the scope of available variables: Block Scope, TDZ.
    
     Reduce the scope so that uncontrollable conditions are less likely to occur.
    
- Reduces the likelihood that a variable can be modified inadvertently: it cannot be arbitrarily redeclared/re-assigned.
    
     Reduce the possibility of unnecessary errors that could contaminate the originally declared variables.
    

 Simply put, `let` and `const` were created to solve the problems that `var` could cause, and when the project is large, the use of `let` and `const` can minimize unintended errors.

 Therefore, in modern development, `let and const` are mostly used, and `var` is avoided as much as possible.

## Summary

|  |  var |  const var |  const |
| --- | --- | --- | --- |
|  Redeclare |  ✅ Can be redeclared |  ❌ Cannot redeclare `SyntaxError: Identifier 'x' has already been declared` |  ❌ Cannot be redeclared `SyntaxError: Identifier 'x' has already been declared` |
|  Re-assignment |  ✅ Can be re-assigned |  ✅ Can be reassigned | `SyntaxError:` Identifier 'x' has already been declared ❌ Cannot be reassigned `TypeError: Assignment to constant variable` |
|  Scope |  Function Scope |  Block Scope |  Block Scope |
|  Hoist |  ✅ Will Hoist |  ✅ Hoist (but will enter TDZ `Reference Error: Cannot access before initialization` ) |  ✅ Hoisted (but with TDZ `Reference Error: Cannot access before initialization` ) |
|  Initialization |  undefined |  None, can't access before initialization |  No, Cannot access before initialization |
|  Syntax introduction year |  ES3 (1999) |  ES6 (2015) |  ES6 (2015) |

## References

https://www.freecodecamp.org/news/differences-between-var-let-const-javascript/#:~:text=var%20and%20let%20create%20variables,use%20let%20or%20const%20instead

https://realdennis.medium.com/%E6%87%B6%E4%BA%BA%E5%8C%85-javascript%E4%B8%AD-%E4%BD%BF%E7%94%A8let%E5%8F%96%E4%BB%A3var%E7%9A%843%E5%80%8B%E7%90%86%E7%94%B1-f11429793fcc

https://www.explainthis.io/zh-hant/swe/js-var-let-const-in-javascript

*《帶你無痛提升 JavaScript 面試力》Ch 1 變數與作用域*