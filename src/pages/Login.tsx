import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, Wheat } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/client'
import { getAuthSession, login, saveAuthSession } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (getAuthSession()) navigate('/', { replace: true })
  }, [navigate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!username.trim() || !password) {
      setError('Enter your username and password to continue.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const session = await login(username.trim(), password)
      saveAuthSession(session)
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Unable to sign in. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-svh overflow-hidden bg-[#f5f0e8] text-[#25231f]">
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#e5c58e]/45 blur-3xl" />
      <div className="absolute -bottom-36 -left-28 h-96 w-96 rounded-full bg-[#bfd0c1]/55 blur-3xl" />

      <section className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[#263c35] p-10 text-[#f9f5ec] lg:flex xl:p-14">
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[28px] border-[#d9a85f]/20" />
        <div className="absolute right-20 top-28 h-20 w-20 rounded-full border border-[#f1d19a]/35" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1b56e] text-[#263c35]">
            <Wheat className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">
            Hearth &amp; Grain
          </span>
        </div>

        <div className="relative max-w-md pb-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#e1b56e]">
            Bakery operations
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight xl:text-6xl">
            Keep every batch moving.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-[#d4dfd7]">
            One calm place to track ingredients, stock, suppliers, and the work
            that keeps your bakery running.
          </p>
        </div>

        <p className="relative text-xs text-[#aebeb4]">
          Inventory management for the people behind the good stuff.
        </p>
      </section>

      <section className="relative flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3 text-[#263c35]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1b56e]">
                <Wheat className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                Hearth &amp; Grain
              </span>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#a4773d]">
              Welcome back
            </p>
            <h2 className="font-serif text-4xl tracking-tight text-[#263c35]">
              Sign in to DD Bakes
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6e716a]">
              Use your team credentials to access bakery operations.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#454941]">Username</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9086]" />
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-12 border-[#d6d2c8] bg-[#fffdf8] pl-10 shadow-none focus-visible:ring-[#718b75]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#454941]">Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9086]" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 border-[#d6d2c8] bg-[#fffdf8] pl-10 shadow-none focus-visible:ring-[#718b75]"
                />
              </div>
            </div>

            {error && <p className="text-sm text-[#b34b3e]" role="alert">{error}</p>}

            <Button
              type="submit"
              className="h-12 w-full bg-[#263c35] text-sm text-[#fffdf8] shadow-[0_8px_20px_-10px_#263c35] hover:bg-[#345247]"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-10 text-center text-xs text-[#8a9086]">
            Contact your administrator if you need access.
          </p>
        </div>
      </section>
    </main>
  )
}