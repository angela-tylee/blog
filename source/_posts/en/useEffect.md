---
title: "useEffect: Not a Lifecycle, but Synchronization"
date: 2026-09-15 16:16:26
categories: Technology
tags:
---

## 1. Why do we need `useEffect`? Start from pure functions

React components are designed to be **pure functions**: given the same props, they should return the same UI description, without touching the outside world along the way.

But real applications always have to touch the outside world. 📖 *React 思維進化* 5-1 calls this class of behavior a **side effect** — any interaction with the external environment:

<!-- more -->

- Reading or writing variables outside the function
- Making network requests
- Mutating DOM elements directly
- Registering timers, event listeners, or subscriptions

So `useEffect` does not exist to "provide lifecycle hooks". It exists to **give side effects a legal exit** — isolating them so they run after the render pass finishes, without blocking rendering.

The thread that connects it all:

```text
Functional Programming → pure functions → side effects → useEffect
```

> The official docs draw the same line: no side effects during render; side effects belong in event handlers or Effects.
> [Keeping Components Pure > Where you can cause side effects](https://react.dev/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

---

## 2. `useEffect` is not a lifecycle API

This is the most important thing I learned here, and the last thing that clicked.

In my course notes I once wrote down the order in which things fire:

1. The function at the component's top level
2. Functions inside render
3. `useEffect`

Paired with the three ways to write dependencies:

| dependency | behavior |
| --- | --- |
| no array | runs after every render |
| `[]` empty array | runs once, on initialization (mount) |
| `[a, b]` non-empty array | runs when a value in the array changes |

The table isn't wrong, but memorizing it as a "lifecycle" breaks down in complex situations. 📖 *React 思維進化* 5-2 puts it bluntly in its title: **useEffect is not actually a function component's lifecycle API**.

> useEffect isn't triggered at a particular point in the lifecycle — it's triggered **whenever it's needed**. The point isn't "when it fires" but "that it fired". That's declarative thinking.

Put differently, `[]` doesn't mean "I want to do something at mount". It means "this side effect doesn't depend on any changing value, so it only needs to synchronize once". The first is imperative scheduling; the second is a declarative description. Same code, completely different mental model.

The title of the official docs page confirms it: it isn't called lifecycle, it's called [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) — **synchronization**, not lifecycle.

And which phase is "initialization", exactly? It's the **commit phase** of mount: `useEffect` only runs after the DOM is actually attached to the screen.

---

## 3. Dependencies: a "condition" that's constantly misused

My first real sticking point looked like this: I put a data request inside `useEffect`, and the screen started re-rendering non-stop. The fix was to add `[]`.

But the question worth asking after the fix is: **why?**

Because a dependency array isn't a list of "trigger conditions" — it's a list of "which changing values this side effect read". After every render, React compares the list item by item with [Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), and re-runs only if something changed. Omitting the list is a declaration that you want it re-run every time.

That leads to two pits everyone falls into:

### 1. Calling `setState` inside an effect and listing that state as a dependency

This combination blows up immediately: the effect changes the state → the state changes → the dependency changes → the effect runs again → infinite loop.

The official advice is to use an updater function, which removes the need to read the previous value from the dependency list:

```jsx
// ❌ count is in the dependencies, and the effect also changes count
useEffect(() => {
  setCount(count + 1);
}, [count]);

// ✅ with an updater, count doesn't need to be a dependency
useEffect(() => {
  setCount(c => c + 1);
}, []);
```

Reference: [Updating state based on previous state from an Effect](https://react.dev/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect), [My Effect keeps re-running in an infinite cycle](https://react.dev/reference/react/useEffect#my-effect-keeps-re-running-in-an-infinite-cycle)

### 2. Lying to ESLint

📖 *React 思維進化* 5-3 is titled "don't lie to your hooks' dependencies". When you see `React Hook useEffect has a missing dependency`, deleting the variable from the list is the fastest painkiller — and the most expensive technical debt. You've told React "this value doesn't affect me", and then some future render hands you a stale closure value.

The right fix is usually one of: move the value into the effect, use an updater function, or move the function itself into the effect.

### 3. While we're here: a function used only inside an effect should be declared inside it

I once got this code review suggestion: "if a function is only called inside `useEffect`, declare it inside the `useEffect`."

The reason is dependencies. A function declared at the component level is a new reference on every render, so listing it as a dependency makes the effect re-run every time — and not listing it triggers the ESLint warning. Move it inside the effect and the dilemma disappears.

---

## 4. Cleanup: from "it runs twice" to memory leaks

### Why does the effect run twice?

In development, React 18 deliberately does a "mount → unmount → mount again" pass so that effects missing a cleanup reveal themselves right away. It isn't a bug; it's a stress test.

Reference: [My Effect runs twice when the component mounts](https://react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts), 📖 *React 求職特訓營* 2.3, 📖 *React 思維進化* 5-4.

If your effect breaks when it runs twice, it was **already broken** — production just hadn't shown you yet.

### What problem does cleanup solve?

**Memory leaks.**

Unmounts happen more often than you'd think: conditional rendering, route changes, a re-render of the parent or of the component itself. On every unmount, any timer, event listener, subscription, or in-flight request you registered earlier and never cancelled keeps living, still holding a reference to a component that no longer exists. And so the page "gets slower the longer it runs" (*React 求職特訓營* 2.1).

The official docs break writing an effect into three steps, and the third one is exactly this:

1. Declare the effect
2. Specify the dependencies
3. **Add cleanup if needed**

```jsx
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer); // cleanup: undo or reverse the previous side effect
}, []);
```

Reference: [Step 3: Add cleanup if needed](https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

As a mental model, cleanup isn't "a funeral for the component when it dies" — it's "**before the next synchronization, undo the last one**". That's also why it runs on every dependency change, not only on unmount.

---

## 5. A few hard rules in practice

- **`useEffect` can only be written at the component's top level** — never inside a conditional or a loop.
- **The callback can't be an `async function` directly.** The return value of `useEffect` is reserved for the cleanup function, and an async function always returns a Promise. If you need async work, wrap it one layer deeper:

```jsx
useEffect(() => {
  const run = async () => {
    const res = await fetch(url);
    // ...
  };
  run();
}, [url]);
```

- **A component can have many `useEffect` calls.** Don't cram unrelated side effects together just to have "one fewer hook" — split them by concern, and the dependencies stay clean.
- **Not every computation belongs in `useEffect`.** A value you can derive from existing state should be computed during render; using an effect to "synchronize" a piece of derived state only buys you an extra render and a fresh set of bugs (*React 求職特訓營* 2.5).

---

## 6. The mental model in one sentence

> `useEffect` isn't "do something at a certain point in time" — it's "**keep an external system in sync with my state**".
>
> Dependencies say "which values the synchronization is based on"; cleanup says "how to undo the previous synchronization".

Put that sentence first, and every pit in this article — infinite loops, running twice, memory leaks, stale closures — turns from "an exception to memorize" into "a consequence of the same principle".

---

## Reference

- [Synchronizing with Effects – React](https://react.dev/learn/synchronizing-with-effects)
- [useEffect – React (API Reference)](https://react.dev/reference/react/useEffect)
- [Lifecycle of Reactive Effects – React](https://react.dev/learn/lifecycle-of-reactive-effects)
- [Keeping Components Pure – React](https://react.dev/learn/keeping-components-pure)
- [Object.is() – MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
- [如何避免前端系統的記憶體洩漏 (memory leak)？｜ExplainThis](https://www.explainthis.io/zh-hant/swe/frontend-memory-leak)
