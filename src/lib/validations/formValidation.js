export function validateForm(form, t) {
  const errors = [];

  if (!form.name.trim()) errors.push(t("form.errors.name"));

  if (
    !form.phoneNumber ||
    form.phoneNumber.length < 8 ||
    form.phoneNumber.length > 10
  )
    errors.push(t("form.errors.phone"));

  if (!form.age || form.age < 18 || form.age > 55)
    errors.push(t("form.errors.age"));

  if (!form.salary) errors.push(t("form.errors.salary"));

  return errors;
}
