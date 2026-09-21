---
title: this 的指向：什麼時候會用到 this？要怎麼用得正確？
categories: Technology
excerpt: >-
  <h4>為什麼要了解 this？實戰常見的 this</h4><p>`this` 是一個 JavaScript 的關鍵字
  (keyword)，通常用以代指呼叫函式時函式前的物件</p><p>然而 `this`
  在不同執行環境下所指向的值也會有所不同</p>以下先列舉常見的實戰用法：
date: 2025-05-05 23:09:21
created: 2025-05-05 23:09:21
tags:
---

{% colorquote appendix %}
學習重點：

- this 的指向與實戰情境
- 預設綁定 (default binding)、隱含綁定 (implicit binding)、明確綁定 (explicit binding)
- 箭頭函式下的 this 爲什麼特別？
- 嚴格模式 (use strict) 下的 this

- 必備前章知識：
- **OOP 與 Prototype 原型：Constructor 建構子、new、class、instance、blueprint** 原型鏈、屬性、方法、類陣列 (forEach) - 看懂 mdn 文件
- 箭頭函式的引用原因、使用時機
{% endcolorquote %}


## 為什麼要了解 this？實戰常見的 this

`this` 是一個 JavaScript 的關鍵字 (keyword)，通常用以代指呼叫函式時函式前的物件

然而 `this` 在不同執行環境下所指向的值也會有所不同

以下先列舉常見的實戰用法：

- 物件內函式 (Object Method)
    
    ```jsx
    const obj = {
    	name: 'Alice',
    	greet: function () {
    		console.log(this.name);
    	},
    };
    obj.greet(); // "Alice"，this 指向呼叫函式前的物件
    ```
    
    - 箭頭函式作為回呼函式 (Arrow Function as Callback Function)
        
        ```jsx
        const obj = {
        	name: 'Alice',
        	greetFriends: function (friends) {
        		friends.forEach((friend) => {
        			console.log(`${this.name} is friends with ${friend}`);
        		});
        	},
        };
        obj.greetFriends(['Bob', 'Charlie']);
        // "Alice is friends with Bob"
        // "Alice is friends with Charlie"
        ```
        
- 函式建構子 (Function Constructor and class / new)
    
    ```jsx
    class Person {
    	constructor(name) {
    		this.name = name;
    	}
    	greet() {
    		console.log(`Hello, my name is ${this.name}`);
    	}
    }
    const alice = new Person('Alice');
    alice.greet(); // "Hello, my name is Alice"，this 指向 alice
    
    ```
    
- 事件處理器 (Event Handlers)
    
    ```jsx
    const button = document.querySelector('button');
    button.addEventListener('click', function () {
    	console.log(this); // this 指向 <button> element
    });
    ```
    

### this 的歷史演進與變遷

`this` 的規則非常繁複，因此除了使用情境外，我也嘗試從這個語法功能的演進來了解 this（所有規則一開始總是最單純最好理解的，但肯定有遇到開發上的困難，才會有後續的規則或功能出現，了解由來會對 this 複雜的規則會更好記憶）

`this` 是從 1995 年 Brendan Eich 推出 JavaScript 以來便存在的語法，目的是讓 JavaScript 更符合 OOP 的特性，能在物件內定義函式 (function)，使物件含有內建方法 (methods)

爾後開發者們開始發現 `this` 容易有非預期的行為，特別是在回呼函式 (callback function) 和 事件處理器 (event handler) 情境下的應用 ( this 會指向全域），此時的開發者常常用 `call`、`apply`，或軟綁定的方式 [[^2]](https://app.notion.com/p/this-this-1438d159628880d8a7a1e8c333a28daa?pvs=21) 將 `this` 儲存到一個變數中（命名為 `self` 或 `that`），作為解決方式

```jsx
// 軟綁定範例
function Timer() {
  const self = this;
  setTimeout(function () {
    console.log(self); // preserves 'this'
  }, 1000);
}
```

2009 年，ES5 釋出 `bind` 作為額外明確綁定 `this` 的方式，可以將 this 的指向儲存在函式中，不須像 `call`, `apply`一般立即呼叫也可以立即綁定

與大部分 JavaScript 語法適用的靜態作用域不同，`this` 一直都是「動態」的，直到 ES6 (2015) 推出箭頭函式 (arrow function)，`this`才在箭頭函式中以「靜態」的方式運作

所謂「動態」就是指，`this` 會依據**呼叫函式時**的執行上下文而有不同的結果 [[^3]](https://app.notion.com/p/this-this-1438d159628880d8a7a1e8c333a28daa?pvs=21)；「靜態」則是指`this` 在**定義函式時**就固定，不會受上下文影響，因此也有人說箭頭函式沒有自己的 `this`

因此 2015 年，ES6 推出箭頭函式 (arrow function)，解決了回呼函式 (callback function) 會喪失 `this` 的問題

## this 指向的規則

`this`的指向與定義時的環境在哪裡無關，而是與呼叫時的環境有關（唯一例外是箭頭函式）

綁定方式通常可分為：

- 預設綁定 (Default Binding) → 即全域下的 this，指向 `window` （全域物件）
- 隱含綁定 (Implicit Binding) → 指向呼叫函式時函式前的物件；箭頭函式則**繼承**定義時所在的**外層作用域的 this**
- 明確綁定 (Explicit Binding) → 要指定 this 的指向固定的話需要使用 `call`, `apply`, `bind`方法，傳入想要綁定的值

以下詳述：

### 預設綁定 / 全域下的 `this` (Default Binding / this in Global Context)

```jsx
// 全域下的 this
console.log(this); // window

// 函式陳述式
function fn1() {
	console.log(this); 
}
fn1(); // window

// 函式表達式
let fn2 = function() {
	console.log(this);
}
fn2(); // window

// 立即函式
(function fn3() {
	console.log(this); // window
})()
```

#### ‘use strict’ 嚴格模式

嚴格模式 'use strict' 下的 this ，只會影響全域下的 `this`和全域下函式的 this ，回傳不一樣的值 

原本會回傳全域物件 `window` 的情境，將回傳 `undefined`

### 隱含綁定 / 隱式綁定 (Implicit Binding）

#### 物件內函式 / 物件下方法 (Object Method / Function in Object)

```jsx
const obj = {
	name: 'Alice',
	greet: function () {
		console.log(this.name);
	},
};
obj.greet(); // "Alice"，this 指向呼叫函式前的物件
```

```jsx
const obj = {
	name: 'Alice',
	greet: () => {
		console.log(this); // window
	}
};
obj.greet(); 
```

#### 隱含的失去 (Implicitly Lost)[[^2]](https://app.notion.com/p/this-this-1438d159628880d8a7a1e8c333a28daa?pvs=21)

隱含失去的意思是：

隱含綁定下的 this 失去綁定的物件，退回到預設綁定的狀態，意即 this 重新指向全域物件 `window` （或 use strict 嚴格模式下的 `undefined`）

當物件下的函式為回呼函式 (callback function) 時，便會發生「隱含的失去」，此時 this 無法將綁定指向預期的值

通常的解決辦法為：

- 軟綁定
- 明確的綁定 call, apply, bind
- 箭頭函式

以下以箭頭函式為例：

```jsx
// 傳統函式作為回呼函式

let obj = {
	myName: 'John',
	fn: function() {
		console.log(this.myName);     // John
		function fn2() {
			console.log(this.myName);   // undefined，傳統函式作為回呼函式會失去原有的 this 指向
		}
		fn2()
	}
}

obj.fn();
```

```jsx

// 箭頭函式作為回呼函式
let obj = {
	myName: 'John',
	fn: function() {
		console.log(this.myName);     // John
		let fn2 = () => {
			console.log(this.myName);   // John，箭頭函式作為回呼函式會繼承外層作用域的 this
		}
		fn2()
	}
}

obj.fn();
```

這邊就要提到，為什麼箭頭函式可以作為解決辦法？

#### 箭頭函式內的 this (this in Arrow Function)

箭頭函式 (Arrow Function)，在 `this` 指向上是很特別的

箭頭函式的 this 是靜態的，也有人說箭頭函式沒有自己的 this，其特性如下：

- 箭頭函式的 this 指向在定義函式時就確定了（繼承所在作用域的 this)，與呼叫的環境沒有關係
- 箭頭函式無法使用 `bind`, `call`, `apply` 改變 `this` [[^5]](https://app.notion.com/p/this-this-1438d159628880d8a7a1e8c333a28daa?pvs=21) （箭頭函式內建 `.bind()` 特性 [[^5]](https://app.notion.com/p/this-this-1438d159628880d8a7a1e8c333a28daa?pvs=21)）
- 箭頭函式不會因為 `'use strict'` 而改變 `this` 指向 [[^5]](https://app.notion.com/p/this-this-1438d159628880d8a7a1e8c333a28daa?pvs=21)
- 箭頭函式不能作為建構函式 / 建構子來使用

這些特性使得箭頭函式特別常用於 callback function，保留外層 this、解決 this 在 callback function 指向混雜的狀況

```jsx
const obj = {
	myMethod: function () {
		console.log(this);    // obj: { myMethod, myArrowMethod }
	},
	myArrowMethod: () => {
		console.log(this);    // window
	}
}
```

{% colorquote info %}
**參考資料 / 延伸閱讀**

靜態作用域：*{% post_link zh-tw/scope-hoist-shadowing 什麼是作用域 (Scope)？以及提升(Hoisting)、遮蔽 (Shadowing)、Lexical Scope、TDZ、參數的傳遞方式 %}*

箭頭函式：箭頭函式的引用原因、使用時機 *(work in progress)*...
{% endcolorquote %}

### 明確綁定 / 顯式綁定 (Explicit Binding) ：Call, Apply, Bind

明確綁定的方式是透過 `call`, `apply`, `bind` 三種函式方法來指定 `this` 指向的值（`call`, `apply`, `bind`是函式物件的內建方法）

三個函式方法都接受兩個或以上參數，第一個參數固定為綁定 `this`指向的物件，

其餘差異在於，調用函式的方式及第二個以上的參數型別：

- `call`、`apply` 可直接呼叫函式
    - `call` 接受兩個以上參數，除第一個參數外的參數直接使用逗號分隔
    - `apply` 接收兩個參數，第一個參數為 `this`綁定的值，第二個參數是陣列
- `bind` 需建立一個新函式，其餘同 `call`

範例：

```jsx
callSomeone.call(Jay, '你好', '早安');
callSomeone.apply(Jay, ['你好', '早安']);
var newCall = callSomeone.bind(Jay, '你好', '早安')
```

範例：

```jsx
function greet(city, country) {
  console.log(`${this.name} says hello from ${city}, ${country}`);
}

const person = {
  name: "Alice"
};
```

```jsx
greet.call(person, "Taipei", "Taiwan");
// Output: "Alice says hello from Taipei, Taiwan"
```

```jsx
greet.apply(person, ["Tokyo", "Japan"]);
// Output: "Alice says hello from Tokyo, Japan"
```

```jsx
const boundGreet = greet.bind(person, "Paris", "France");
boundGreet(); 
// Output: "Alice says hello from Paris, France"
```

## 總結

- `this`的指向與定義時的環境在哪裡無關，而是與呼叫時的環境有關（唯一例外是箭頭函式）
    - 預設綁定 (Default Binding) → 即全域下的 this，指向 `window` （全域物件）
    - 隱含綁定 (Implicit Binding) → 指向呼叫函式時函式前的物件；箭頭函式則**繼承**定義時所在的**外層作用域的 this**
    - 明確綁定 (Explicit Binding) → 要指定 this 的指向固定的話需要使用 `call`, `apply`, `bind`方法，傳入想要綁定的值
- `this` 一直都是「動態」的，直到 ES6 (2015) 推出箭頭函式 (arrow function)，`this`才在箭頭函式中以「靜態」的方式運作
- 要讓 `this` 指向固定的話：
    - 箭頭函式 (Arrow Function)
    - 明確綁定 (Explicit Binding)：`call`, `apply`, `bind`

## 參考資料

- *《帶你無痛提升面試力》*5.3 this
- [1] https://web.dev/learn/javascript/functions/this#new-binding
- [2] https://www.cythilya.tw/2018/10/23/this/
- [3] https://kuro.tw/posts/2017/10/12/What-is-THIS-in-JavaScript-%E4%B8%8A/
- [4] https://kuro.tw/posts/2017/10/17/What-s-THIS-in-JavaScript-%E4%B8%AD/
- [5] https://kuro.tw/posts/2017/10/20/What-is-THIS-in-JavaScript-%E4%B8%8B/
- [5] https://kuro.tw/posts/2017/10/20/What-is-THIS-in-JavaScript-%E4%B8%8B/
- https://github.com/getify/You-Dont-Know-JS
- https://www.w3schools.com/js/js_this.asp
- https://www.geeksforgeeks.org/javascript-this-keyword/
- https://dev.to/nikolasbarwicki/is-this-keyword-a-problem-1ind
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#description
- https://javascript.plainenglish.io/how-well-do-you-know-this-ce4355bc9b
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_basics#what_is_this
- https://medium.com/analytics-vidhya/javascripts-this-keyword-strict-bind-call-apply-79fc35039832