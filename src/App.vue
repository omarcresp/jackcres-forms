<template>
  <div>
    <input
      v-model="controls.email"
      type="email"
      name="email"
      placeholder="example@mail.com"
    >
    <p v-if="errors.name">{{ errors.name }}</p>
    
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
