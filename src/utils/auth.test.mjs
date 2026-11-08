import assert from "node:assert/strict";
import test from "node:test";

import { validateAuthForm } from "./auth.ts";

test("login requires a valid email and password", () => {
  assert.deepEqual(validateAuthForm("login", { email: "not-an-email", password: "" }), {
    email: "Masukkan email yang valid.",
    password: "Masukkan password.",
  });
});

test("registration requires name and a ten-character password", () => {
  assert.deepEqual(
    validateAuthForm("register", {
      email: "user@example.com",
      name: " ",
      password: "pendek",
    }),
    {
      name: "Nama minimal 2 karakter.",
      password: "Password minimal 10 karakter.",
    },
  );
});

test("valid registration has no validation errors", () => {
  assert.deepEqual(
    validateAuthForm("register", {
      email: "user@example.com",
      name: "Budi Limbara",
      password: "rahasia-yang-kuat",
    }),
    {},
  );
});
