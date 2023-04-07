# vue3 基础

- Vue3 [官方文档](https://cn.vuejs.org/guide/quick-start.html)

### 对于vue2更新（优化）的方面
- Performance：性能优化
- Tree-shaking support：支持摇树优化
- Composition API：组合API
- Fragment，Teleport，Suspense：新增的组件
- Better TypeScript suppo rt：更好的TypeScript支持
- Custom Renderer API：自定义渲染器

## 新建vue3项目

```js
//webpack
//与vue2一样，记得选3.x版本

npm create vue3-demo


//vite
//新一代构建工具，默认支持vue3版本
//社区也有很多模板方便构建

# npm 6.x
npm create vite@latest vue3-demo --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest vue3-demo -- --template vue

# yarn
yarn create vite vue3-demo --template vue

# pnpm
pnpm create vite vue3-demo --template vue

```

### 目录结构

- vue3的目录结构与vue2类似，都是main.js作为入口文件
- 但vite创建的vue3项目可能没有安装vuex和vue-router，需要自行安装

- 创建实例对象的方法也与vue2不同
- 创建实例用的是从vue里的导出的createApp方法来创建。 还有 router 和store 是通过插件方式引入

- **vue2**
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

- **vue3**
```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
```

## composition API

在vue2，我们通过各种 数据 方法，计算属性，监控属性（data,methods,computed,watch）来实现我们的功能，而随着项目的扩大，逻辑的增多，我们的代码也会越来越难以看懂，这也是vue被吐槽的地方，而现在的组合式API就是来解决这个痛点的

### setup

- vue3的全新配置项
- 组件用到的数据方法，都需要声明在setup中

- **注意**
  + 尽量不要和vue2混用
  + vue2的配置(data，methods，computed...)可以访问到setup中的方法和属性
  + setup不能访问到vue2中的配置
  + 如果变量名冲突，以vue3为主
  + 执行时间早于beforeCrate，所以this指向为undefined

```vue
<template>
    <div>
        <h1>点击按钮数字加一</h1>
        <h2>{{num}}</h2>
        <button @click="add">按钮</button>
    </div>
</template>

<script>
export default {
  //vue2写法
//   data(){
//     return{
//         num:0
//     }
//   },
//   methods:{
//     add(){
//         this.num++
//     }
//   }

  // vue3写法
    setup(){
        let num = 0  //视图不会更新
        function add(){
            num++
        }
        return{
            num,
            add
        }
    }
  
}

</script>
```

### ref和reactive

- 都是vue3创建响应式数据的方法
- ref声明的数据在使用和修改时，需要 .value ,模板中不需要 
- ref声明基本类型数据的响应式原理和vue2相同
- ref声明复杂类型数据是通过reactive二次包装，响应式原理是Proxy代理
  + 推荐使用ref声明基本类型，reactive声明复杂类型
```vue
<template>
    <div>
        <h1>点击按钮数字加一</h1>
        <h2>{{num}}</h2>
        <button @click="add">按钮</button>
    </div>
</template>

<script>
import {ref,reactive} from 'vue'
export default {
    setup(){
        let num = ref(0) 
        let obj = reactive({
          name:'小明',
          age:19
        })
        function add(){
            num.value++
        }
        return{
            num,
            add,
            obj
        }
    }
  
}

</script>
```

- **Proxy响应式的大致原理**
```js
let preson = {
    name: '张三',
    age: 18
}
let presonProxy = new Proxy(preson, {
    // target: 目标对象
    // key: 目标对象的属性

    // get: 读取目标对象的属性时触发
    get(target, key) {
        console.log('get', key);
        return target[key]
    },
    // set: 设置和修改目标对象的属性时触发
    set(target, key, value) {
        console.log('set', key, value);
        target[key] = value
    },
    // deleteProperty: 删除目标对象的属性时触发
    deleteProperty(target, key) {
        console.log('delete', key);
        return delete target[key]
    }
})
```
### computed 计算属性

 - 和vue2的computed配置基本一样

```vue
<script>
import { reactive, computed} from 'vue'
export default {
    setup(){
        let obj = reactive({
          num1: 15,
          num2: 19
        })
        //计算属性简写形式
        let add = computed(()=>{
            return obj.num1 + obj.num2
        })

        //计算属性完整写法
        let add = computed({
            //获取
            get(){
                return obj.num1 + obj.num2
            },
            //修改
            set(value){
                //value 是修改后add的值
            }

        })
        return{
            add,
            obj
        }
    }
  
}
</script>

```

### watch 监听属性（侦听器）
- 和vue2的watch配置功能一致
- 监听ref定义的数据不需要.value,只需要监听变量即可

::: details 注意
- 监听reactive定义的响应式数据时，oldvalue无法正确获取。（deep配置失效）
- 监听reactive定义的响应数据某个属性时，deep配置有效（深度监听）
:::

```vue
<script>
import { ref,reactive,watch} from 'vue'
export default {
    setup(){
        let num1 = ref(1)
        let num2 = ref(2)
        let obj = reactive({
            name:'小明'，
            age:18
        })
        //1监听ref定义的数据
        watch(num1,(oldvalue,newvalue)=>{
            console.log(`num1发生了变化，新值是${newvalue}`)
        },{immediate:true})
        //2监视多个ref定义的数据
        watch([num1,num2],(oldvalue,newvalue)=>{
            console.log(`num1或num2发生了变化，新值是${newvalue}`)
        })
        //3监听reactive定义的数据
        watch(obj,(oldvalue,newvalue)=>{
            console.log(`obj发生了变化，新值时${newvalue}`)
        },{deep:false}) //deep 配置失效，默认开启深度监听
        //4监听reactive定义数据的某个属性
        watch(()=>obj.age,(oldvalue,newvalue)=>{
            console.log(`obj的age属性发生了变化，新值是${newvalue}`)
        })

        //deep     深度鉴定
        //immediate     即时监听（准备完成就监听一次）
    }
}
</script>
```

### watchEffect
- 和`watch`一样为监听属性
- 不需要指明监听那个对象，自动监听回调中用到的对象
- 效果上和`computed`(计算)属性类似，但`computed`需要回调返回值，`watchEffect`只监听过程

```js
let num = ref(0)
let sum = ref(5)

watchEffect(()=>{
    console.log(num.value)
    //监听num
})

num.value++
```
停止侦听器:

```js
let stop = watchEffect(()=>{})
//当不需要该监听器时
stop()
```
### vue3生命周期

1. setup() : 开始创建组件之前，在 beforeCreate 和 created 之前执行，创建的是 data 和 method

2. onBeforeMount() : 组件挂载到节点上之前执行的函数；

3. onMounted() : 组件挂载完成后执行的函数；

4. onBeforeUpdate(): 组件更新之前执行的函数；

5. onUpdated(): 组件更新完成之后执行的函数；

6. onBeforeUnmount(): 组件卸载之前执行的函数；

7. onUnmounted(): 组件卸载完成后执行的函数；

8. onActivated(): 被包含在 `<keep-alive>` 中的组件，会多出两个生命周期钩子函数，被激活时执行；

9. onDeactivated(): 比如从 A 组件，切换到 B 组件，A 组件消失时执行；

10. onErrorCaptured(): 当捕获一个来自子孙组件的异常时激活钩子函数。


- 与vue2生命周期对比

```js
vue2           ------->      vue3
 
beforeCreate   -------->      setup(()=>{})
created        -------->      setup(()=>{})
beforeMount    -------->      onBeforeMount(()=>{})
mounted        -------->      onMounted(()=>{})
beforeUpdate   -------->      onBeforeUpdate(()=>{})
updated        -------->      onUpdated(()=>{})
beforeDestroy  -------->      onBeforeUnmount(()=>{})
destroyed      -------->      onUnmounted(()=>{})
activated      -------->      onActivated(()=>{})
deactivated    -------->      onDeactivated(()=>{})
errorCaptured  -------->      onErrorCaptured(()=>{})
```

::: tip 注意
- 删除了`beforeCreate`、`created` 两个钩子使用`setup`钩子来替代
- `beforeDestroy`和`destroyed`，用`onBeforeUnmount`和`onUnmounted`来替代
- vue3的钩子除`setup`外，并不都需要写在`setup()`或者`<script setup>`内的词法上下文中，也可以在一个外部函数中调用，只要调用栈是同步的，且最终起源自`setup()`就可以。
:::

### toRef和toRefs
- toRef
基于响应式对象上的一个属性，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值将更新 ref 的值，反之亦然。

```js
import { toRef,reactive } from 'vue'
let sum = reactive({
    num1:20,
    num2:30,
    jm:{
        bo:5
    }
})
let boref = toRef(sum.jm,'bo')//第一个参数是对象即可
let num1ref = toRef(sum,'num1')

num1ref.value++
console.log(num1ref,sum.num1)//21,21
//更新num1ref会更新原属性 sum.num1

sum.num1++
console.log(num1ref,sum.num1)//22,22
//更新原属性会相应toref
```

- toRefs
将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。每个单独的 ref 都是使用 toRef() 创建的

```js
import { toRefs,reactive } from 'vue'
let sum = reactive({
    num1:20,
    num2:30,
    jm:{
        bo:5
    }
})
const sumrefs = toRefs(sum)
//sumrefs的每一项都被toRef处理过，结构使用不影响响应式
let {num1,num2,jm} = sumrefs
num++
console.log(sum.num1, sumrefs.num1.value, num1.value)//21,21,21
```

### composition API 优势
::: tip 与vue2的选项式API相比
- 可以更优雅的组织代码和函数，让功能相关的代码组织在一起
:::

### `<script setup>` 语法糖
`<script setup>`是vue3新增的语法糖

#### 基本用法

- 要启用该语法，需要在`<script>`代码块上添加`setup`属性
- `<script>`在首次引入执行一次，`<script setup>`每次创建实例都会执行
```vue
<script setup>
    console.log('hello word!')
</script>
```

#### 默认暴露

在`<script setup>`中创建的变量，函数，不需要`return`暴露，模板可直接使用

```vue
<script setup>
    import { ref } from 'vue'
    let msg = ref('hello word!')

    function conlog(){
        console.log(msg.value)
    }
</script>
<template>
  <button @click="conlog">{{ msg }}</button>
</template>
```

#### 使用组件

`<script setup>`范围里的值可以直接作为自定义组件的标签名使用

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

也可以作为动态组件引用,使用`:is`绑定

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
//   使用三元表达式来判断引用那个组件
</template>
```

