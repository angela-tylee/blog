---
title: Data Type - Type Conversion and Comparison, True and False Values
date: 2025-04-19 23:05:51
categories: Technology
tags:
---

{% colorquote appendix %}
You will learn…

- The 8 types of JavaScript
- Methods of Type Conversion: Explicit coercion, Implicit coercion
- Primitive Wrapper Objects
- Rules for comparing types: Loose equality, strict equality.
- True and False Values
{% endcolorquote %}

## JavaScript has 8 Data Types

 JavaScript has 8 types: 7 primitive data types and 1 object data type.

 Among them, **those that do not belong to object data type are primitive** data **types**:
<!-- more -->
- Primitive Data Type
    - string
    - Primitive Data Type string
    - null
    - undefined
    - undefined
    - bigInt
    - symbol

- Object Data Type
    - undefined
    - Data Type object
    - function
    
{% colorquote warning %}
**Notes / Tips / Pitfalls**

 Common data structures such as `array` and `function` are object types as long as they are not primitive types.
{% endcolorquote %}
    

|  Characteristics |  Primitive [^2] |  Object |
| --- | --- | --- |
| **Mutable** |  immutable: cannot be modified after creation |  mutable: content can be modified. |
| **Methods and attributes** |  No built-in methods or attributes (but JavaScript temporarily provides methods in the form of wrapped objects) |  Have methods and attributes that can be manipulated directly |
| **Stored by Reference** |  Stored by Value: the value is copied when the value is given, occupying a new memory location. |  Stored by Reference: the reference is copied and pointed to the same memory location when the value is assigned. |
| **Changing the value of one of the variables** |  Does not affect another variable |  affects another variable because it points to the same object |

 Types can be verified with the `typeof` operator

![](./images/typeof.png)

### Pitfalls of `typeof`

```jsx
typeof null              // 'object'，`null` 屬於原始型別，但是會回傳 'object'
typeof NaN               // 'number'
typeof function() {}     // "function"，函式屬於物件 (object) ，但是會回傳 'function'
typeof [1, 2, 3].        // 'object'
Array.isArray([1, 2, 3]) // 應改用 isArray() 檢驗型別
```

{% colorquote tips %}
**Tip / Additional Knowledge**

 The values that can be returned by `typeof` are:

 'undefined', 'boolean', 'string', 'number ', 'bigint', 'symbol', 'object', 'function'[^1].**
{% endcolorquote %}

## Type Conversion / Type Coercion

 As we all know, JavaScript is a loosely typed language, you don't need to specify the type of the variable when you declare it, you can change the type freely later, and JavaScript will convert the type "by itself" during compilation (what the hell?!).

![](./images/it-was-a-disaster.gif)

{% colorquote info %}
**References / Extended Reading**

**JavaScript 屬於直譯式語言、弱型別、動態型、單執行緒、同步語言、FP + OOP 語言** *(work in progress)*...
{% endcolorquote %}

 The advantage is that it's easy and fast to write, and saves a lot of trouble; the disadvantage is that if you don't understand the conversion rules, you're likely to encounter unintended errors!

 Therefore, it is important for JavaScript developers to be aware of how to convert types on their own, and how JavaScript converts types.

 There are two types of type conversion:

- explicit coercion: developer-initiated type conversions
- implicit coercion: type conversion done by JavaScript during compilation.

{% colorquote tips %}
**Tips / Additional Knowledge**

 According to MDN:

- The term **Type Conversion** encompasses both implicit and explicit conversions.
- **Type Coercion** more closely describes implicit  **coercion**  = type conversion by JS rather than by the developer.

     So strictly speaking, there should be no such thing as "explicit" coercion.


 However, it is a common practice in the academic world to use "implicit coercion" and "explicit coercion" to refer to implicit and explicit coercion, so this article follows such a convention
{% endcolorquote %}

### Explicit Coercion

 If you need to convert types in development, you can use the following methods:

|  Target type |  Original type wrapped object |  Other methods |  Example |
| --- | --- | --- | --- |
| **String** | `String(value)` | `value.toString()` | `String(123)` → `"123"toString()` Commonly used for objects and values, not `null/undefined`. |
| **String(value)** | `Number(value)` | `parseInt(value, base)parseFloat(value)+value` | `Number("123")` → `123parseInt("2")` → `2parseFloat("3.14")` → `3.14+ "42"` → `42` |
| **Boolean** | `Boolean(value)` |  `value value` | `Boolean(0)` → `false!!!" hello"` → `true` |

#### Primitive Wrapper Objects

 As mentioned earlier, primitive types don't have their own methods or attributes.

 But what's confusing is why strings can have attributes and methods like `toUpperCase()` and `length`?

 That's because JavaScript created the **Primitive Wrapper Object**  mechanism in order to allow primitive types to have properties and methods that can be called.

 The mechanism and role of **Primitive Wrapper Object** :

- Autoboxing: When you call a property or method of a primitive type, JavaScript temporarily wraps the primitive type into an object type, and then discards the object after the property and method are used [^3], a process called "Autoboxing" [^4] .
- Providing methods and properties: By wrapping the prototype of an object, primitive types can use methods such as `toUpperCase()` (String), `toLocalString() ` (Number), etc.
    - All primitive types other than `null and undefined` have primitive wrappers.

 Example [^5]:

```jsx
let language = 'JavaScript';
let str = language.toUpperCase();
```

 Autoboxing ↓ 

```jsx
let language = 'JavaScript';
let tmp = new String(language); // 以 new String() 將原始型別轉換為物件型別
str = temp.toUpperCase();       // 調用 String() 所提供的方法
temp = null;                    // 丟棄物件型別
```

 Primitive Wrapper is a mechanism in JavaScript designed to allow primitive types to have object behavior, which fully embodies the concept of OOP (object-oriented programming) in JavaScript.

{% colorquote tips %}
**Tips / Supplementary Knowledge**

**OOP, object-oriented programming**:

 This refers to the use of objects as the basic units of a program, encapsulating data (values) and behaviors (methods) that manipulate that data, in order to increase the reusability, flexibility, and extensibility of the software [^6].
{% endcolorquote %}

### Implicit Coercion

 The timing of an implicit coercion is contained:

- when using `==` (loose equality) and comparing values of different types → all are converted to **numbers**  (cf. loose equality )
- using the `+` operator
    - as a unary operator → convert to **value (number)**
    - as a binary operator and one of the operators is a string or an object → all are converted to strings **(string)**
        - if none of the operators is a string or an object → as an arithmetic operator, all are converted to **a numeric value (number)**
- When using arithmetic operators (e.g. `-`, `*`, `/`, etc.) → all are converted to **numbers.**
- in logical operations (e.g. `||`, `&&` ) or `if` condition judgment → to **boolean** (cf. true & false )

```jsx
console.log(0 == '0');  // true，因為字串 '0' 會轉換成數字 0
console.log(1 == true); // true，因為 true 會轉換成數字 1
```

```jsx
console.log(+'5')               // 5，`+`作為一元運算子，字串 '5'，轉換成數字 5
console.log('5' + 2);          // '52'，數字 2 被轉為字串 '2'，然後與 '5' 拼接
console.log({} + 'hello');     // '[object Object]hello'，空物件被轉為字串 '[object Object]'
console.log(5 + true);         // '5true'，true 被轉為字串 'true'
```

```jsx
console.log('10' - 5);    // 5，字串 '10' 被轉換為數字 10
console.log('6' * 2);     // 12，字串 '6' 被轉換為數字 6
console.log('20' / 4);    // 5，字串 '20' 被轉換為數字 20
console.log(true - 1);    // 0，true 被轉換為數字 1，然後 1 - 1 結果為 0
```

```jsx
console.log('' || 'default');  // 'default'，空字串 '' 被轉換為 false，返回右邊的 'default'
console.log(0 && 'test');      // 0，數字 0 被轉換為 false，返回 0
console.log(null || undefined); // undefined，null 被轉換為 false，返回右邊的 undefined
console.log(3 > 2 && 5 < 10);  // true，兩個條件都為 true，結果為 true
```

### Supplementary: Other **Data Structure Transformation Methods**

|  Source → target type |  Methods |  Example |
| --- | --- | --- |
|  JSON → Object / Array | `JSON.parse(jsonString)` | `'{"a":1}'` → `{a:1}` |
|  Object / Array → JSON | `JSON.stringify(value)` | `{a:1}` → `'{"a":1}'` |
|  String → Array | `split()` | `"a,b".split(",")` → `["a", "b"]` |
|  Array → String | `join()` | `["a", "b"].join("-")` → `"a-b"` |
|  Object → Array | `Object.keys()Object.value()Object.entries()` | `Object.keys({a: 1, b: 2})` → `["a", "b"]Object.values({a: 1, b: 2})` → `[1, 2]Object.entries({a: 1})` → `[["a", 1]]` |
|  Arrays / NodeList → Array | `Array.from()`, `spread...` |  |

{% colorquote info %}
**Reference / Extended Reading**

 Array of classes:

**OOP 與 Prototype 原型：Constructor 建構子、new、class、instance、blueprint** 原型鏈、屬性、方法、類陣列 (forEach) - 看懂 mdn 文件 *(work in progress)*...

**DOM: Node > Element > Token (NodeList 類陣列）Frequently manipulate nodes** *(work in progress)*...
{% endcolorquote %}

## Type Comparison

 There are two operators for comparing values:

- Equality `==`: when two types are different, the comparison is automatically converted to a number (when both are of the same type, the comparison is treated as strict equality)
- Strict Equality `===` ): do not convert type (return `true` only if value is equal and type is the same).

 Conclusion: Due to the unpredictable nature of loose equality `==`, it is generally recommended to use `===` instead of `==` as much as possible.

 Example: Loosely Equal `==`

```jsx
0 == '0'         // true：'0' 字串轉成數字 0
false == 0       // true：false 轉成 0
false == ''      // true：'' 轉成 false，再變 0
null == undefined // true：唯一特例，這兩個是彼此相等
' \t\r\n ' == 0  // true：字串轉成數字 0
'123' == 123     // true：字串轉數字
[] == false      // true：空陣列轉成空字串再變成 0
[0] == 0         // true：陣列轉成 '0' 再變成 0
[1] == true      // true：一樣的邏輯
```

 Example: strict equality `===`

```jsx
0 === '0'        // false：數字與字串型別不同
false === 0      // false：布林值與數字型別不同
null === undefined // false：型別不同
'123' === 123    // false：型別不同
[] === false     // false：型別不同
[] === []        // false：不同的物件參考（即使內容一樣）
```

### Pitfalls of Comparing Types

- Object types are not equal to each other
    
    ```jsx
    [] == []    // false
    ```
    

{% colorquote info %}
**References / Extended Reading**

 Call by Sharing: 物件：物件為什麼不能相等？物件 vs 變數的求值策略（傳值？傳址？傳參考？）*(work in progress)*...
{% endcolorquote %}

- `null`, `undefined`, `NaN`
    - `NaN` cannot be equal to any value, including itself.
    - `null`, `undefined` are equal only to themselves and each other, but not to anything else.

```jsx
null == null           // true
null == 0              // false
null == ''             // false
null == false          // false

undefined == ''        // false
undefined == 0         // false
undefined == false     // false

NaN == NaN             // false，NaN 無法和任何值相等，包含他自己
Number.isNaN(NaN)      // true，應改用 isNaN()檢驗

null == undefined      // true，這兩者只與自己和彼此互相相等
```

|  Loosely equal `==` | `null` | `undefined` | `NaN` |  `false NaN` | `0` | `false` |
| --- | --- | --- | --- | --- | --- | --- |
| **`null`** |  ✅ |  ✅ |  ❌ |  null |  ❌ |  ❌ |
| **`undefined`** |  ✅ |  ✅ |  ❌ |  ❌ |  undefined |  ✅ |
| **`NaN`** |  undefined |  ❌ |  ❌ |  ❌ |  ❌ |  ❌ |
| **`''`** |  ❌ |  ❌ |  ✅ |  ✅ |  ✅ |  ✅ |
| **`0`** |  ❌ |  ✅ |  ❌ |  ✅ |  ✅ |  ✅ |
| **`false`** |  ✅ |  false |  ✅ |  ✅ |  ✅ |  ✅ |

{% colorquote info %}
**Reference / Extended Reading**

is not defined、undefined、NAN、null *(work in progress)*...
{% endcolorquote %}

## True, False

 Place the value into the `Boolean()` wrapped object to check it as true/false:

- Objects: objects `{}`, arrays `[],` functions..., etc. are all true regardless of null. etc. are **`true`** regardless of whether they are null or not.
    - So an empty array is usually determined by `[].length === 0.`
- String: any value in a string is considered true, an empty string is **false** . **`false`**
- Number: 0 is a **false value `false`**
- `null`, `undefined`, `NaN`: **False `false`**

```jsx
Boolean("")             // false
Boolean({})             // true
Boolean([])             // true，因此是否為空陣列通常是以 [].length === 0 來做判斷
Boolean(function(){})   // true
```

{% colorquote info %}
**Reference / Extended Reading**

 Ternary Operators, II && Operators **Operators 運算子：Prefix & Postfix、&& ||** *(work in progress)*...
{% endcolorquote %}

## Summary

 Summary of key points:

- Types
    - JavaScript has 8 types
        - 7 primitive types: string, number, null, undefined, boolean, bigint, symbol
        - 1 object type
    - `NaN` is a numeric type; `array`, `function` are numeric object types.
- Type Conversion
    - Visible conversion: Primitive Wrapper Object
    - Implicit conversions: ==, +, arithmetic operators, logical operators
        - `+` As a binary operator, if there is a string or an object before or after it, the operator will be converted to a string, otherwise it will be treated as a number.
- Type Comparison
    - Loose equality: when types are different, they are converted to numeric comparisons.
        - `NaN` cannot be equal to any value, including itself.
        - `null`, `undefined` are equal only to themselves and each other, but not to anything else.
        - Objects are not equal to each other
    - Strict equality: values and types must be the same.
    - Use strict equality `===` as much as possible, avoid loose equality `===`
- True and False Values
    - Object types: objects `{}`, arrays `[],` functions..., etc. are all equal regardless of null. etc. are **true**  whether or not they are null **`true`**
    - String: any value in a string is considered true, empty string is **false `false`**
- Commonly used type and typeof conversion checking method:
    - `typeof` Check type
    - `toString()` checks the value converted to a string during implicit transformation.
    - `Number()` checks the value after a loose equality conversion.
    - `Boolean()` checks for true and false values.

## Remarks

 I thought it would be much simpler to just talk about types, but it turns out that this is going to be the article I spent the most hours writing, and there are really a lot of details.

 In order to understand JavaScript types, we will come across the concept of OOP (Object-oriented Programming).

- obvious transformation → Primitive Wrapper Object → OOP
- loosely typed → dynamic types, intuitive language

 But I think the design of encapsulating attributes and methods with objects makes JavaScript full of possibilities.

 Layered logic makes me think that the characteristics of OOP give JavaScript wonderful extensibility and reusability.

 Maybe I'm obsessed with efficiency and logic, and this kind of logic is worth exploring and utilizing for me.

 I'll write another article in the future to explore the concepts of primitives and OOP.

## References

- [^1] https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/typeof
- [^2] https://blog.stackademic.com/primitives-and-wrapper-objects-in-javascript-70212c7fcb33
- [^3] https://javascriptrefined.io/the-wrapper-object-400311b29151
- [^4] https://library.fridoverweij.com/docs/jstutorial/primitive_wrapper_objects.html#autoboxing
- [^5] https://www.javascripttutorial.net/javascript-primitive-wrapper-types/
- [^6] https://zh.wikipedia.org/zh-tw/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1
- https://developer.mozilla.org/en-US/docs/Glossary/Type_Conversion
- https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion
- https://developer.mozilla.org/en-US/docs/Glossary/Primitive#autoboxing_primitive_wrapper_objects_in_javascript
- https://javascript.info/primitives-methods
- https://en.wikipedia.org/wiki/Boxing_(computer_programming)#Boxing
- https://www.cythilya.tw/2018/10/15/coercion/