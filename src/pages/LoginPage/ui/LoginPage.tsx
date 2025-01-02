import { useState } from 'react'
import Input from '@/shared/ui/Input/Input'
import cls from './LoginPage.module.scss'
import Button from '@/shared/ui/Button/Button'
import { loginAction } from '@/features/authentication/loginAction/loginAction'
import { Link } from 'react-router-dom'

export const LoginPage = () => {

    console.log('LoginPage');

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        if (!email || !password) {
            setError('All fields are required')
            return
        }
        loginAction({ email, password })
    }

    return (
        <div className={cls.loginPage}>
            <form className={cls.loginForm} onSubmit={handleSubmit}>
                <Input type="email" placeholder="Email" autoFocus autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" full rounded='sm'>Login</Button>
                {error && <div className={cls.error}>{error}</div>}
            </form>
            <div className={cls.registerLink}>
                <p>Нет аккаунта?</p>
                <Link to="/register">Зарегистрируйтесь</Link>
            </div>
        </div>
    )
}