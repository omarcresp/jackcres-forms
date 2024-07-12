# @jackcres/forms

A reactive forms library for Vue 3

### Initialize form
```ts
const form = useForm({
    name: '',
    lastname: '',
})
```

> form.controls // v-model

```vue
<input v-model="form.controls.name" />
```

> form.errors // vars with errors

```vue
<p v-if="form.errors.name">{{form.errors.name}}</p>
```

> form.submit // or save or onSubmit or ...

```ts
const values = form.submit()

```
