import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import MegaMenu from './components/MegaMenu.jsx'
import FloatingWidgets from './components/FloatingWidgets.jsx'
import HeroSlider from './components/HeroSlider.jsx'
import LoginModal from './components/LoginModal.jsx'
import FacultyPortal from './components/FacultyPortal.jsx'

function App() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [facultyPortalOpen, setFacultyPortalOpen] = useState(false)

  // Listen for faculty portal open event
  useEffect(() => {
    const handleOpenFacultyPortal = () => setFacultyPortalOpen(true)
    window.addEventListener('openFacultyPortal', handleOpenFacultyPortal)
    return () => window.removeEventListener('openFacultyPortal', handleOpenFacultyPortal)
  }, [])

  return (
    <div className="page">
      <Header onLogin={() => setLoginOpen(true)} />

      <section className="header-query-section">
        <div className="header-query-content">
          <div className="header-query-message">Have any admission questions? We're here to help!</div>
          <button 
            className="header-query-button pill pill-blue"
            onClick={() => document.getElementById('admission-query')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ask Admission Query
          </button>
        </div>
      </section>

      <HeroSlider />

      <section className="features">
        <h3 className="section-title">Our Pillars of Excellence</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-ico">🎓</div>
            <div className="feature-title">110-Acre Campus</div>
            <div className="feature-sub">Modern infrastructure and green spaces</div>
          </div>
          <div className="feature-card">
            <div className="feature-ico">🏊</div>
            <div className="feature-title">20+ Sports Facilities</div>
            <div className="feature-sub">Olympic-size pool, cricket ground, indoor complex</div>
          </div>
          <div className="feature-card">
            <div className="feature-ico">🏨</div>
            <div className="feature-title">19 Modern Hostels</div>
            <div className="feature-sub">Comfortable accommodation and amenities</div>
          </div>
          <div className="feature-card">
            <div className="feature-ico">🔬</div>
            <div className="feature-title">50+ Research Labs</div>
            <div className="feature-sub">State‑of‑the‑art labs for research and learning</div>
          </div>
          <div className="feature-card">
            <div className="feature-ico">📚</div>
            <div className="feature-title">Central Library</div>
            <div className="feature-sub">Extensive books, journals and digital resources</div>
          </div>
          <div className="feature-card">
            <div className="feature-ico">📶</div>
            <div className="feature-title">Wi‑Fi Campus</div>
            <div className="feature-sub">High‑speed internet across the campus</div>
          </div>
        </div>
      </section>

      <section className="placements">
        <h3 className="section-title">Our Placement Success Stories</h3>
        <div className="cards">
          <div className="place-card">
            <div className="place-name">Ananya Reddy</div>
            <div className="place-role">Product Manager at Amazon</div>
            <div className="place-ctc">Package: ₹18 LPA</div>
            <div className="place-badge">Leadership Award</div>
          </div>
          <div className="place-card">
            <div className="place-name">Vikram Kumar</div>
            <div className="place-role">Research Scientist at Pfizer</div>
            <div className="place-ctc">Package: ₹16 LPA</div>
            <div className="place-badge">Research Pioneer</div>
          </div>
          <div className="place-card">
            <div className="place-name">Zara Khan</div>
            <div className="place-role">Structural Engineer at L&T</div>
            <div className="place-ctc">Package: ₹15 LPA</div>
            <div className="place-badge">Infrastructure Expert</div>
          </div>
        </div>

        <div className="counters">
          <div className="counter"><div className="count">5000</div><div>Students Placed</div></div>
          <div className="counter"><div className="count">500</div><div>Recruiting Companies</div></div>
          <div className="counter"><div className="count">95</div><div>Placement Rate</div></div>
          <div className="counter"><div className="count">₹ 15</div><div>Average Package</div></div>
        </div>
      </section>

      <section className="recruiters">
        <h3 className="section-title">Our Top Recruiters</h3>
        <div className="logo-strip">
          <span className="logo-chip">Google</span>
          <span className="logo-chip">Microsoft</span>
          <span className="logo-chip">Amazon</span>
          <span className="logo-chip">Tesla</span>
          <span className="logo-chip">Infosys</span>
          <span className="logo-chip">TCS</span>
          <span className="logo-chip">Wipro</span>
          <span className="logo-chip">HCL</span>
        </div>
      </section>

      <section id="admission-query" className="query-panel">
        <div className="query-header">Admission Query</div>
        <div className="query-message-container">
          <div className="query-message">Any query ask here</div>
          <button className="query-button pill pill-blue">Ask Now</button>
        </div>
        <form className="query-form" onSubmit={(e)=>e.preventDefault()}>
          <input placeholder="Your Name" required />
          <input placeholder="Email" type="email" required />
          <input placeholder="Phone" required />
          <textarea placeholder="Your message" rows="3" />
          <button type="submit" className="pill pill-green">Submit</button>
        </form>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of students who have chosen GLA University for their higher education</p>
          <div className="cta-buttons">
            <a href="#" className="pill pill-green">Apply Now</a>
            <a href="#" className="pill">Download Brochure</a>
            <a href="#" className="pill">Virtual Tour</a>
            <button 
              className="pill pill-blue" 
              onClick={() => document.getElementById('admission-query')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Admission Query
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">© {new Date().getFullYear()} GLA University</footer>
      <FloatingWidgets />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <FacultyPortal open={facultyPortalOpen} onClose={() => setFacultyPortalOpen(false)} />
    </div>
  )
}

export default App
