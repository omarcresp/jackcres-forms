# @jackcres/forms
# ⚠️ WIP this library hasnt been published yet
A reactive forms library for Vue 3 inspired in angular reactive forms

## Quickstart
```vue
<template>
  <input v-model="controls.email">
  <input v-model="controls.password">

  <button @click="handleSubmit()">Submit</button>
</template>

<script setup lang="ts">
import { useForm } from '@jackcres/forms';

const { controls, ...loginForm } = useForm({
  email: '',
  password: '',
});

function handleSubmit() {
  const values = loginForm.getValues()

  console.log(values)
}
</script>
```

## Adding validators
You can add fields validators that will check the value on change and will throw errors in the errors map

```vue
<template>
  <div>
    <input
      v-model="controls.email"
      type="email"
      name="email"
      placeholder="example@mail.com"
    >
    <p v-if="errors.email">{{ errors.email }}</p>
    
    <input
      v-model="controls.password"
      type="password"
      name="password"
      placeholder="*********"
    >
    <p v-if="errors.password">{{ errors.password }}</p>

    <button @click="handleSubmit()" type="submit">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { useForm, Validators } from '@jackcres/forms';

const { controls, errors, ...loginForm } = useForm({
  email: {
    value: '',
    validators: [Validators.email, Validators.required]
  },
  password: {
    value: '',
    validators: [Validators.min(8), Validators.required]
  },
});

function handleSubmit() {
  loginForm.touch() // runs all validations, even fields that werent modified

  if (!loginForm.valid) return

  const values = loginForm.getValues()
}
</script>
```

## Create a custom validator
The validators of the form are just function that takes the value as param and returns an string with an error message, if no error then it should returns an empty string `''`
```typescript
function required(val: string | boolean | number) {
  return !val ? 'Required error' : ''
}
```

# WIP
Next steps includes
- [ ] reset function
- [ ] array forms
- [ ] nested forms
- [ ] custom directive
- [ ] touched state (runs validations until user first blur the input)
- [ ] form wide validators
- [ ] debounce validators (opt-in)
