import { useState } from "react"
import Input from "@/shared/ui/Input/Input"
import cls from "./LoginPage.module.scss"
import Button from "@/shared/ui/Button/Button"
import { loginAction } from "@/features/authentication/loginAction/loginAction"
import { Link } from "react-router"
import { ToastType } from "@/shared/ui/Toast"
import { isActionError } from "@/shared/types/actionErrorType/ActionError"
import { useAsyncAction } from "@/shared/hooks/useAsyncAction"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { isLoading, execute: executeLogin } = useAsyncAction(loginAction)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("All fields are required")
      return
    }
    try {
      await executeLogin({ email, password })
    } catch (error) {
      if (isActionError(error)) {
        toast(
          error.message,
          error.errorLevel === "low" ? ToastType.WARNING : ToastType.ERROR,
        )
        return
      }
      toast(
        "Произошло чтото не хорошее :(\nПопробуйте перезагрузить страницу",
        ToastType.ERROR,
      )
    }
  }

  return (
    <div className={cls.loginPage}>
      <form className={cls.loginForm} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" full rounded="sm" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </Button>
        {error && <div className={cls.error}>{error}</div>}
      </form>
      <div className={cls.registerLink}>
        <p>Нет аккаунта?</p>
        <Link to="/register">Зарегистрируйтесь</Link>
      </div>
    </div>
  )
}
