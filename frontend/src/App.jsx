import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from './features/userSlice'

export default function App() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user.user)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      await dispatch(signIn({ email, password })).unwrap()
    } catch (err) {
      alert(err.message || err)
    }
  }

  return (
    <div className="container">
      <h1>Aquarium Commerce (Demo)</h1>
      {user ? (
        <p>Signed in as {user.email}</p>
      ) : (
        <form onSubmit={handleSignIn}>
          <div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          </div>
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          </div>
          <button type="submit">Sign In</button>
        </form>
      )}
    </div>
  )
}
