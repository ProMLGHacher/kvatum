import { useState } from "react"
import cls from "./RegisterPage.module.scss"
import Input from "@/shared/ui/Input/Input"
import Button from "@/shared/ui/Button/Button"
import { isActionError } from "@/shared/types/actionErrorType/ActionError"
import { isAxiosError } from "axios"
import { registerAction } from "@/features/authentication/registerAction/registerAction"
import { requestRegistrationAction } from "@/features/authentication/requestRegistrationAction/requestRegistrationAction"
import { Link } from "react-router-dom"

export default () => {
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")

  const [requestedPassword, setRequestedPassword] = useState("")
  const [code, setCode] = useState("")
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    if (!email || !nickname || !password) {
      setError("All fields are required")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      requestRegistrationAction({ email, nickname, password }).then((_) =>
        setRequestedPassword(email),
      )
    } catch (error) {
      isAxiosError
      if (isActionError(error)) {
        setError(error.message)
      }
    }
  }

  const handleCompleteRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    if (!code) {
      setError("Code is required")
      return
    }
    try {
      registerAction({ email, verificationCode: code }).then((_) =>
        setRequestedPassword(email),
      )
    } catch (error) {
      isAxiosError
      if (isActionError(error)) {
        setError(error.message)
      }
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
          <Button type="submit" full rounded="sm">
            Register
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
        <Button type="submit" full rounded="sm">
          Register
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
