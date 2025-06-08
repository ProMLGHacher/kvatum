import { useState } from "react"
import cls from "./RegisterPage.module.scss"
import Input from "@/shared/ui/Input/Input"
import Button from "@/shared/ui/Button/Button"
import { isActionError } from "@/shared/types/actionErrorType/ActionError"
import { registerAction } from "@/features/authentication/registerAction/registerAction"
import { requestRegistrationAction } from "@/features/authentication/requestRegistrationAction/requestRegistrationAction"
import { Link } from "react-router"
import { ToastType } from "@/shared/ui/Toast"
import { useAsyncAction } from "@/shared/hooks/useAsyncAction"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")

  const [requestedPassword, setRequestedPassword] = useState("")
  const [code, setCode] = useState("")

  const {
    isLoading: isLoadingRequestRegistration,
    execute: executeRequestRegistration,
  } = useAsyncAction(requestRegistrationAction)

  const { isLoading: isLoadingRegister, execute: executeRegister } =
    useAsyncAction(registerAction)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    if (!email || !nickname || !password) {
      setError("Вы не заполнили все поля")
      return
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }
    try {
      await executeRequestRegistration({ email, nickname, password })
      setRequestedPassword(email)
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

  const handleCompleteRegistration = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    setError("")
    if (!code) {
      setError("Code is required")
      return
    }
    try {
      await executeRegister({ email, verificationCode: code })
      setRequestedPassword(email)
      setCode("")
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
    setError("")
  }

  if (requestedPassword) {
    return (
      <div className={cls.registerPage}>
        <form
          className={cls.registerForm}
          onSubmit={handleCompleteRegistration}
        >
          <Input
            type="text"
            placeholder="Code"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button type="submit" full rounded="sm" disabled={isLoadingRegister}>
            {isLoadingRegister ? "Loading..." : "Register"}
          </Button>
          {error && <div className={cls.error}>{error}</div>}
        </form>
      </div>
    )
  }

  return (
    <div className={cls.registerPage}>
      <form className={cls.registerForm} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Nickname"
          autoComplete="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="submit"
          full
          rounded="sm"
          disabled={isLoadingRequestRegistration}
        >
          {isLoadingRequestRegistration ? "Loading..." : "Register"}
        </Button>
        {error && <div className={cls.error}>{error}</div>}
      </form>
      <div className={cls.loginLink}>
        <p>Уже есть аккаунт?</p>
        <Link to="/login">Войдите</Link>
      </div>
    </div>
  )
}
