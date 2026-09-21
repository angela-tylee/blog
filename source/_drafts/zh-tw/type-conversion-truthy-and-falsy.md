---
title: 型別：型別的轉換 (Type Conversion) 與比較、真假值
date: 2025-04-19 23:05:51
categories: Technology
tags:
---

## 8 種型別

JavaScript 共有 8 種型別：7 個原始型別 (primitive data type)、1 個物件型別 (object data type)

其中，**不屬於物件型別的皆為原始型別**：
<!-- more -->
- 原始型別 Primitive Data Type
    - string
    - number
    - null
    - undefined
    - boolean
    - bigInt
    - symbol

- 物件型別 Object Data Type
    - object
    - array
    - function
    
{% colorquote warning %}
**注意 / 提示 / 陷阱**

常見的資料結構如 `array`、`function` ，只要不是原始型別，都屬於物件型別
{% endcolorquote %}
    

| 特徵 | 原始型別 (Primitive) [[^2]](https://app.notion.com/p/Type-Conversion-1388d1596288806199eae83501bc7a45?pvs=21) | 物件型別 (Object) |
| --- | --- | --- |
| **可變性** | 不可變（immutable）：創建後無法修改 | 可變（mutable）：內容可被修改 |
| **方法與屬性** | 沒有內建方法或屬性（但 JavaScript 會臨時以包裝物件形式提供方法） | 擁有方法和屬性，可以直接操作 |
| **儲存方式** | 以值儲存（Stored by Value）：賦值時會複製值，佔用新記憶體空間 | 以參考儲存（Stored by Reference）：賦值時複製的是參考，指向同一個記憶體位置 |
| **改變其中一個變數的值** | 不會影響另一個變數 | 會影響另一個變數，因為指向同一個物件 |

型別可以用 `typeof` 運算子來檢驗

![](./images/typeof.png)

### `typeof` 的陷阱

```jsx
typeof null              // 'object'，`null` 屬於原始型別，但是會回傳 'object'
typeof NaN               // 'number'
typeof function() {}     // "function"，函式屬於物件 (object) ，但是會回傳 'function'
typeof [1, 2, 3].        // 'object'
Array.isArray([1, 2, 3]) // 應改用 isArray() 檢驗型別
```

{% colorquote tips %}
**小提示 / 補充知識**

`typeof` 可以回傳的值有：

‘undefined’、‘boolean’、‘string’、‘number’、‘bigint’、‘symbol’、‘object’、**‘function’ [[^1]](https://app.notion.com/p/Type-Conversion-1388d1596288806199eae83501bc7a45?pvs=21)**
{% endcolorquote %}

## 型別轉換 (Type Conversion / Type Coercion)

眾所皆知，JavaScript 是一個弱型別 (loosely typed) 語言，宣告時不用指定變數的型別、能在後續自由更換型別，JavaScript 也會在編譯的過程中依據需求「自行」轉換型別（什麼鬼？！）

![](./images/it-was-a-disaster.gif)

{% colorquote info %}
**參考資料 / 延伸閱讀**

**JavaScript 屬於直譯式語言、弱型別、動態型、單執行緒、同步語言、FP + OOP 語言**
{% endcolorquote %}

好處是撰寫時很方便又快速，省去許多麻煩；壞處就是如果沒有搞懂轉換的規則，就容易遇到非預期的錯誤

因此 JavaScript 的開發者必須清楚只到如何自主轉換型別，以及 JavaScript 會如何轉換型別

型別轉換分為兩種：

- 顯性轉換 (explicit coercion)：開發者自主進行的型別轉換
- 隱性轉換 (implicit coercion)：JavaScript 在編譯過程中進行的型別轉換

{% colorquote tips %}
**小提示 / 補充知識**

根據 MDN：

- **Type Conversion** 一詞包含隱性及顯性轉換的意思
- **Type Coercion** 則更貼近於描述隱性轉換 **(implicit coercion)** = 由 JS 進行型別轉換而非開發者主動進行的轉換

    因此嚴格來說並不應該有 “explicit” coercion 的說法


不過學界普遍已習慣以 “implicit coercion”、”explicit coercion” 來指稱隱性轉換及顯性轉換，因此此文也依照這樣的慣例撰寫
{% endcolorquote %}

### 顯性轉換 (Explicit Coercion)

如果在開發中需要轉換型別，開發者可以使用以下方法：

| 目標型別 | 原始型別包裹物件 | 其他方法 | 範例 |
| --- | --- | --- | --- |
| **String** | `String(value)` | `value.toString()` | `String(123)` → `"123"`

`toString()` 常用於物件與數值，不適用於 `null/undefined` |
| **Number** | `Number(value)` | `parseInt(value, base)`

`parseFloat(value)`

`+value`
 | `Number("123")` → `123`

`parseInt("2")` → `2`

`parseFloat("3.14")` → `3.14`

`+"42"` → `42` |
| **Boolean** | `Boolean(value)` | `!!value` | `Boolean(0)` → `false`

`!!"hello"` → `true` |

#### 原始型別包裹物件 (Primitive Wrapper Object)

如前文提到，原始型別並沒有自己的方法或屬性

但讓人困惑的是，為什麼字串 (string) 也可以有 `toUpperCase()` 和 `length`  等屬性及方法可以使用？

那是因為 JavaScript 為了讓原始型別也擁有屬性 (property) 及方法 (method) 可以調用，而創造了**原始型別包裹物件 (Primitive Wrapper Object)** 的機制

**原始型別包裹物件 (Primitive Wrapper Object)** 的機制及作用：

- Autoboxing：當你要調用原始型別 (primitive) 的屬性 (property) 或方法 (methods) 時，JavaScript 會暫時將原始型別包裝成物件型別，當屬性及方法使用完畢後，再將物件丟棄 [[^3]](https://app.notion.com/p/Type-Conversion-1388d1596288806199eae83501bc7a45?pvs=21)，這過程被稱為「Autoboxing」 [[^4]](https://app.notion.com/p/1388d159628880469c21cc44b8d5d400?pvs=21)
- 提供方法與屬性：透過包裹物件的原型（prototype），原始型別可使用如 `toUpperCase()`（字串）、`toLocalString()`（數字）等方法
    - 除了 `null、undefined` 之外的原始型別，都有原始型別包裹物件可以使用

範例[[^5]](https://app.notion.com/p/Type-Conversion-1388d1596288806199eae83501bc7a45?pvs=21)：

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

Primitive Wrapper 是 JavaScript 中為了讓原始型別也能具備物件行為而設計的機制，這充分體現了 JavaScript 中 OOP (object-oriented programming) 的概念

{% colorquote tips %}
**小提示 / 補充知識**

**OOP, object-oriented programming（物件導向程式設計）**：

指的便是將物件作為程式的基本單元，將資料（值）和操作該資料的行為（方法）封裝其中，以提高軟體的重用性、靈活性和擴充性 [[^6]](https://app.notion.com/p/Type-Conversion-1388d1596288806199eae83501bc7a45?pvs=21)
{% endcolorquote %}

### 隱性轉換 (Implicit Coercion)

隱性轉換的時機包含：

- 使用 `==`（寬鬆相等）且比較不同型別的值時 → 皆轉換為**數值 (number)**  (參考 寬鬆相等）
- 使用 `+` 運算子
    - 作為一元運算子時 → 轉換為**數值 (number)**
    - 作為二元運算子，且其中一個是字串或物件 → 皆轉換為**字串 (string)**
        - 若運算元皆非字串或物件 → 則當作算數運算子，皆轉換為**數值 (number)**
- 使用算術運算子（如 `-`、`*`、`/` 等）時 → 皆轉換為**數值 (number)**
- 在邏輯運算（如 `||`、`&&`）或 `if` 條件判斷中 → 轉換為**布林值 (boolean)** (參考 真值 & 假值）

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

### 補充：其他**資料結構轉型方式**

| 來源 → 目標型別 | 方法 | 範例 |
| --- | --- | --- |
| JSON → Object / Array | `JSON.parse(jsonString)` | `'{"a":1}'` → `{a:1}` |
| Object / Array → JSON | `JSON.stringify(value)` | `{a:1}` → `'{"a":1}'` |
| String → Array | `split()` | `"a,b".split(",")` → `["a", "b"]` |
| Array → String | `join()` | `["a","b"].join("-")` → `"a-b"` |
| Object → Array | `Object.keys()` 
`Object.value()` 
`Object.entries()` | `Object.keys({a: 1, b: 2})` → `["a", "b"]`
`Object.values({a: 1, b: 2})` → `[1, 2]`
`Object.entries({a: 1})` → `[["a", 1]]` |
| 類陣列 / NodeList → Array | `Array.from()`, `spread...` |  |

{% colorquote info %}
**參考資料 / 延伸閱讀**

類陣列：

**OOP 與 Prototype 原型：Constructor 建構子、new、class、instance、blueprint** 原型鏈、屬性、方法、類陣列 (forEach) - 看懂 mdn 文件

DOM: Node > Element > Token (NodeList 類陣列）Frequently manipulate nodes
{% endcolorquote %}

## 型別比較

比較值時有兩種運算子：

- 寬鬆相等 (Equality `==`) ：當兩邊的型別不同時，會自動轉換為數字型別 (number) 做比較（當兩者皆為同一型別時，即為視同嚴格相等的比較）
- 嚴格相等 (Strict Equality `===` )：不轉換型別（值相等、型別也相同，才會回傳 `true`)

先說結論：出於寬鬆相等 `==` 難以預測的特性，普遍建議盡量使用 `===` ，而不要使用 `==`

範例：寬鬆相等 `==`

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

範例：嚴格相等 `===`

```jsx
0 === '0'        // false：數字與字串型別不同
false === 0      // false：布林值與數字型別不同
null === undefined // false：型別不同
'123' === 123    // false：型別不同
[] === false     // false：型別不同
[] === []        // false：不同的物件參考（即使內容一樣）
```

### 型別比較的陷阱

- 物件型別互不相等
    
    ```jsx
    [] == []    // false
    ```
    

{% colorquote info %}
**參考資料 / 延伸閱讀**

Call by Sharing：物件：物件為什麼不能相等？物件 vs 變數的求值策略（傳值？傳址？傳參考？）
{% endcolorquote %}

- `null`、`undefined`、`NaN`
    - `NaN` 無法和任何值相等，包含他自己
    - `null`、`undefined` 兩者只與自己和彼此相互相等，其他都互不相等

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

| 寬鬆相等 `==` | `null` | `undefined` | `NaN` | `''` | `0` | `false` |
| --- | --- | --- | --- | --- | --- | --- |
| **`null`** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **`undefined`** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **`NaN`** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **`''`** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **`0`** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **`false`** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

{% colorquote info %}
**參考資料 / 延伸閱讀**

is not defined、undefined、NAN、null
{% endcolorquote %}

## 真值、假值

將值放進 `Boolean()` 包裹物件中，即可檢驗為真 / 假值：

- 物件型別 (object)：物件 `{}`、陣列 `[]`、函式...等，不論是否空值皆為**真值 `true`**
    - 因此是否為空陣列通常是以 `[].length === 0` 來做判斷
- 字串型別 (string)：字串有任何值都視為真值，空字串為**假值 `false`**
- 數字型別 (number)：0 為**假值 `false`**
- `null`、`undefined`、`NaN`：為**假值 `false`**

```jsx
Boolean("")             // false
Boolean({})             // true
Boolean([])             // true，因此是否為空陣列通常是以 [].length === 0 來做判斷
Boolean(function(){})   // true
```

{% colorquote info %}
**參考資料 / 延伸閱讀**

三元運算子、II && 運算子 **Operators 運算子：Prefix & Postfix、&& ||**
{% endcolorquote %}

## 總結

重點摘要：

- 型別
    - JavaScript 有 8 種型別
        - 7 個原始型別：string, number, null, undefined, boolean, bigint, symbol
        - 1 個物件型別
    - `NaN` 屬數字型別；`array` 、`function` 數物件型別
- 型別轉換
    - 顯性轉換：原型包裹物件 (Primitive Wrapper Object)
    - 隱性轉換：==、+、算數運算子、邏輯運算子
        - `+` 作為二元運算子，且前後有字串或物件時，會將運算元轉換為字串 (string) 處理，其餘狀況皆作為數值 (number) 處理
- 型別比較
    - 寬鬆相等：型別不同時轉換為數值比較
        - `NaN` 無法和任何值相等，包含他自己
        - `null`、`undefined` 兩者只與自己和彼此相互相等，其他都互不相等
        - 物件互不相等
    - 嚴格相等：值、型別皆須相同
    - 盡量使用嚴格相等 `===`，避免使用寬鬆相等 `==`
- 真假值
    - 物件型別 (object)：物件 `{}`、陣列 `[]`、函式...等，不論是否空值皆為**真值 `true`**
    - 字串型別 (string)：字串有任何值都視為真值，空字串為**假值 `false`**
- 常用型別與型別轉換後的檢驗方法：
    - `typeof` 檢驗型別
    - `toString()` 檢驗在隱性轉型時轉換為字串的值
    - `Number()` 檢驗寬鬆相等轉型後的數值
    - `Boolean()` 檢驗真假值

## 後記

原本以為只是講述型別會簡單得多，結果本篇快要是我花最多時數撰寫的文章，細節真的好多

要了解 JavaScript 型別，就會接觸到 OOP (Object-oriented Programming) 的概念

- 顯性轉換 → Primitive Wrapper Object → OOP
- loosely typed → 動態型別、直譯式語言

但是我認為用物件封裝屬性及方法的設計，使得 JavaScript 在使用上充滿可能性

層層邏輯讓我覺得 OOP 的特性賦予了 JavaScript 很美妙擴展性與複用性

可能我對效率及邏輯有一種執著吧，這樣的邏輯對我來說非常值得探究及善用

未來會再寫一篇探討原形及 OOP 的概念

## 參考資料

[^1]https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/typeof
[^2]https://blog.stackademic.com/primitives-and-wrapper-objects-in-javascript-70212c7fcb33
[^3]https://javascriptrefined.io/the-wrapper-object-400311b29151
[^4]https://library.fridoverweij.com/docs/jstutorial/primitive_wrapper_objects.html#autoboxing
[^5]https://www.javascripttutorial.net/javascript-primitive-wrapper-types/
[^6]https://zh.wikipedia.org/zh-tw/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1
https://developer.mozilla.org/en-US/docs/Glossary/Type_Conversion
https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion
https://developer.mozilla.org/en-US/docs/Glossary/Primitive#autoboxing_primitive_wrapper_objects_in_javascript
https://javascript.info/primitives-methods
https://en.wikipedia.org/wiki/Boxing_(computer_programming)#Boxing
https://www.cythilya.tw/2018/10/15/coercion/