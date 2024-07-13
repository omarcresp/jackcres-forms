const {controls, errors, ...loginForm} = useForm({
  email: {
    value: '',
    validators: [required, email],
  },
  password: '',
});

function handleSubmit() {
  loginForm.touch()

  if (!loginForm.valid) return

  console.log(loginForm.getValue());
}
