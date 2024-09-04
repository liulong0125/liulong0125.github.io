---
layout: post
title: TypeScript
categories: [软件]
tags: [TypeScript]
---

``TypeScript`` 具有类型系统，且是 ``JavaScript`` 的超集。 它可以编译成普通的 ``JavaScript`` 代码。

# TypeScript

+ [基础类型](#基础类型)
+ [接口](#接口)



## 基础类型

```typescript
// 布尔值
let completed: boolean = false;
console.log('completed', completed);

// 数值
let count: number = 1;
console.log('count', count);

// 数值
let username: string = 'jack';
console.log('username', username);

// 数组
let arr1: number[] = [1, 2, 3];
console.log('arr1', arr1);
let arr2: Array<number> = [3, 2, 1];
console.log('arr2', arr2);

// 元组 - 声明一类数据
let collect: [string, number] = ['a', 2];
console.log(collect[0].toString());

// 枚举
enum Color {Red, Green, Blue};
let c: Color = Color.Green;
console.log(c); // 打印值为按照索引从 0 开始

// 枚举 - 设置开始索引（也可以手动给每个都指定）
enum Size {Big = 5, Medium, Small};
let s: Size = Size.Medium;
console.log(s); // 6

// 任意值 - 可以存储任意类型
let anyType: any = 4;
let anyTypeList: any[] = [1, true, 'a'];

// 空值 - 基本类型(只能赋值 undefined、null)
let voidBaseType: void = undefined;
console.log(voidBaseType);

// 空值 - 方法
function emptyFunc(): void {
    console.log('方法无返回值');
}

// Null、Undefined - 只能赋值给自身
let u: undefined = undefined;
let n: null = null;

// 类型断言 - 方式一
let assert1: any = 'this is string';
let num1: number = (<string>assert1).length;

// 类型断言 - 方式二(JSX 仅支持此种方式)
let assert2: any = 'this is string';
let num2: number = (assert2 as string).length;
```




## 接口

