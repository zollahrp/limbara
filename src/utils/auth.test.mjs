import assert from "node:assert/strict";
import test from "node:test";

import { validateLoginForm, validateRegisterForm } from "./auth.ts";

test("login requires a valid email and password", () => {
  assert.deepEqual(validateLoginForm({ email: "not-an-email", password: "" }), {
    email: "Masukkan email yang valid.",
    password: "Masukkan password.",
  });
});

test("valid login only requires email and password", () => {
  assert.deepEqual(validateLoginForm({ email: "user@example.com", password: "rahasia" }), {});
});

test("registration requires name and a twelve-character password", () => {
  assert.deepEqual(
    validateRegisterForm({
      email: "user@example.com",
      name: " ",
      password: "pendek",
    }),
    {
      name: "Nama minimal 2 karakter.",
      password: "Password minimal 12 karakter.",
    },
  );
});

test("valid registration has no validation errors", () => {
  assert.deepEqual(
    validateRegisterForm({
      email: "user@example.com",
      name: "Budi Limbara",
      password: "rahasia-yang-kuat",
    }),
    {},
  );
});
