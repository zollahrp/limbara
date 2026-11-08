export type AuthMode = "login" | "register";

export interface AuthFormValues {
  email: string;
  password: string;
  name?: string;
}

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

export function validateAuthForm(mode: AuthMode, values: AuthFormValues): AuthFormErrors {
  const errors: AuthFormErrors = {};
  const email = values.email.trim();
  const name = values.name?.trim() ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Masukkan email yang valid.";
  }
  if (mode === "register" && name.length < 2) {
    errors.name = "Nama minimal 2 karakter.";
  }
  if (!values.password) {
    errors.password = "Masukkan password.";
  } else if (mode === "register" && values.password.length < 10) {
    errors.password = "Password minimal 10 karakter.";
  } else if (values.password.length > 128) {
    errors.password = "Password maksimal 128 karakter.";
  }

  return errors;
}
