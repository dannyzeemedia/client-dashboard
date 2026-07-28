import { useState } from 'react'
import { supabase } from './supa.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setErr(error.message)
  }

  return (
    <div className="center">
      <form className="login" onSubmit={submit}>
        <div className="login-brand">Client Reporting</div>
        <div className="login-sub">Sign in to view your performance dashboard.</div>
        <label>Email
          <input type="email" value={email} autoComplete="email" required
                 onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Password
          <input type="password" value={password} autoComplete="current-password" required
                 onChange={(e) => setPassword(e.target.value)} />
        </label>
        {err && <div className="login-err">{err}</div>}
        <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
