import Logo from './Logo.jsx'
export default function Header({ onLogin }) {
  return (
    <>
       <div className="top-ribbon">
         <div className="left">
           <Logo className="logo-ribbon" />
           <span className="badge">Accredited with A+ Grade by NAAC</span>
         </div>
        <div className="cta-group">
          <button className="pill">Admission Open</button>
          <button className="pill">Rolling Advertisement</button>
          <button className="pill pill-yellow">Student</button>
          <button className="pill pill-yellow">Examination</button>
          <button className="pill pill-yellow">IQAC</button>
          <button className="pill pill-yellow">NRPP</button>
          <button className="pill pill-yellow">Careers</button>
          <button className="pill pill-yellow">ICPC</button>
          <a className="helpline" href="#">Admission Helpline 9027068068</a>
        </div>
       </div>
      <nav className="main-nav">
        <ul className="menu" style={{justifyContent:'space-between'}}>
          <div style={{display:'flex',gap:24,alignItems:'center'}}>
            <li className="menu-item">About Us
              <div className="mega">
                <div>
                  <a href="#">Who We Are</a>
                  <a href="#">Leadership</a>
                  <a href="#">CSR Activities</a>
                </div>
              </div>
            </li>
            <li className="menu-item">Academics
              <div className="mega">
                <div>
                  <a href="#">Institutes</a>
                  <a href="#">Departments</a>
                  <a href="#">Exams & Results</a>
                </div>
              </div>
            </li>
            <li className="menu-item">Courses
              <div className="mega">
                <div>
                  <a href="#">Graduate</a>
                  <a href="#">Post Graduate</a>
                  <a href="#">Doctoral</a>
                </div>
              </div>
            </li>
            <li className="menu-item">Admissions</li>
            <li className="menu-item">Campus Life</li>
            <li className="menu-item">Placements</li>
            <li className="menu-item">Research & Innovation</li>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <input placeholder="Search" style={{height:30,padding:'4px 10px',borderRadius:8,border:'1px solid #999'}} />
            <button className="pill" style={{margin:0}} onClick={onLogin}>Login</button>
            <button className="pill pill-green" style={{margin:0}}>☰</button>
          </div>
        </ul>
      </nav>
    </>
  )
}


