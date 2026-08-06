export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value) {
  const digits = value.replace(/[^0-9]/g, "");
  return (
    digits.length === 10 ||
    (digits.length === 12 && digits.startsWith("91"))
  );
}

export function validatePersonForm(form) {
  const errors = {};

  if (!form.name || !form.name.trim()) {
    errors.name = "Please enter your full name.";
  }

  if (!form.email || !form.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!isValidEmail(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (form.phone && form.phone.trim() && !isValidPhone(form.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
