import Logo from './Logo.jsx'
import { useEffect, useMemo, useState } from 'react'

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i=0;i<6;i++) out += chars[Math.floor(Math.random()*chars.length)]
  return out
}

export default function LoginModal({ open, onClose }) {
  const [tab, setTab] = useState('')
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [input, setInput] = useState({ id:'', password:'', captcha:'' })
  const [error, setError] = useState('')

  useEffect(()=>{ 
    setError('')
    if (open) {
      setTab('') // Reset to category selection every time modal opens
      setInput({ id:'', password:'', captcha:'' })
      setCaptcha(generateCaptcha())
    }
  }, [open])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    if (!input.id || !input.password || !input.captcha) {
      setError('Please fill all fields')
      return
    }
    if (input.captcha.toUpperCase() !== captcha) {
      setError('Invalid CAPTCHA')
      setCaptcha(generateCaptcha())
      setInput({...input, captcha:''})
      return
    }
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: input.id,
          password: input.password
        })
      })
      
      const data = await response.json()
      
      if (data.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        
        if (data.user.role === 'teacher') {
          // Open faculty portal
          window.dispatchEvent(new CustomEvent('openFacultyPortal'))
        } else {
          // Open student portal or show success
          alert(`Welcome ${data.user.name}! Student login successful!`)
        }
        onClose()
      } else {
        setError(data.message || 'Login failed')
        setCaptcha(generateCaptcha())
        setInput({...input, captcha:''})
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
      setCaptcha(generateCaptcha())
      setInput({...input, captcha:''})
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        {!tab && (
          <div>
            <div className="modal-header" style={{justifyContent:'center', position:'relative'}}>
              <Logo className="modal-logo" />
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body" style={{alignItems:'center'}}>
              <div style={{fontWeight:800, color:'#374151', marginBottom:8}}>Select Login Type</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%'}}>
                <button className="pill" onClick={()=>setTab('faculty')}>Faculty Login</button>
                <button className="pill pill-green" onClick={()=>setTab('student')}>Student Login</button>
              </div>
            </div>
          </div>
        )}
        {!!tab && (
          <>
            <div className="modal-header" style={{justifyContent:'center', position:'relative'}}>
              <Logo className="modal-logo" />
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div style={{display:'flex', alignItems:'center', padding:'10px 16px', borderBottom:'1px solid #e5e7eb', background:'#f9fafb'}}>
              <button onClick={() => { setTab(''); setError(''); setInput({ id:'', password:'', captcha:'' }); setCaptcha(generateCaptcha()); }} style={{background:'none', border:'none', cursor:'pointer', color:'#0b4d2b', fontWeight:600, display:'flex', alignItems:'center', gap:4}}>
                ← Back
              </button>
              <div style={{flexGrow:1, textAlign:'center', fontWeight:700, color:'#333'}}>
                {tab === 'student' ? 'Student Login' : 'Faculty Login'}
              </div>
            </div>
            <form className="modal-body" onSubmit={submit}>
              <label>Login ID</label>
              <input placeholder="Enter your User ID" value={input.id} onChange={(e)=>setInput({...input, id:e.target.value})} required />
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={input.password} onChange={(e)=>setInput({...input, password:e.target.value})} required />
              <label>Captcha</label>
              <div className="captcha-row">
                <div className="captcha-box" role="img" aria-label="captcha">{captcha}</div>
                <input placeholder="Enter captcha" value={input.captcha} onChange={(e)=>setInput({...input, captcha:e.target.value})} required />
                <button type="button" className="pill" onClick={()=>setCaptcha(generateCaptcha())}>↻</button>
              </div>
              {error && <div className="error-text">{error}</div>}
              <div className="modal-actions">
                <label className="remember"><input type="checkbox" /> Remember me</label>
                <button type="submit" className="pill pill-green" style={{marginLeft:'auto'}}>Login</button>
              </div>
            </form>
            <div className="modal-footer">
              <a href="#">Forgot Password?</a>
              <a href="#">Help & Support</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


