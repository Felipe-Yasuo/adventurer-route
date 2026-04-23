export function humanizeError(code: string | null) {
  if (!code) return null;

  if (code === "EmailJaCadastrado") {
    return "Esse email já possui conta criada no site. Entre com email e senha.";
  }

  if (code === "CredentialsSignin") return "Email ou senha inválidos.";

  if (code === "OAuthCreateAccount") {
    return "Não foi possível criar a conta com Google.";
  }

  if (code === "OAuthAccountNotLinked") {
    return "Esse email já existe com outro método. Entre com o método original.";
  }

  return "Não foi possível entrar. Tente novamente.";
}
