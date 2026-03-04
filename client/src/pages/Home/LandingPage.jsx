import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useScrollReveal } from '../../hooks/useScrollReveal'; 
import styles from './LandingPage.module.css';

const sectorTrendData = [
  { year: '2020', tech: 400, health: 600, finance: 300, energy: 200 },
  { year: '2021', tech: 900, health: 850, finance: 450, energy: 250 },
  { year: '2022', tech: 1200, health: 800, finance: 600, energy: 400 },
  { year: '2023', tech: 1100, health: 900, finance: 550, energy: 550 },
  { year: '2024', tech: 1350, health: 950, finance: 700, energy: 800 },
  { year: '2025', tech: 1600, health: 1100, finance: 850, energy: 1100 },
  { year: '2026', tech: 1950, health: 1250, finance: 1000, energy: 1400 },
];

const LandingPage = () => {
  useScrollReveal(); 

  return (
    <div className={styles.pageContainer}>
      
      {/* SECTION 1: HERO */}
      <section className={styles.heroSection}>
        <div className={styles.introContent}>
          <span className={styles.badge}>Next-Gen HRMS v2.0</span>
          <h1>Bridge the Gap Between <br/> <span className={styles.blue}>Ambition</span> and <span className={styles.blue}>Opportunity</span></h1>
          <p className={styles.introSub}>
            ModernHR is a specialized Enterprise Resource Planning (ERP) system designed 
            to automate the complex lifecycle of recruitment. We provide a transparent path 
            for students and high-tech tools for HR professionals.
          </p>
        </div>
      </section>

      {/* SECTION 2: DUAL VALUE */}
      <section className={`${styles.dualValueSection} reveal-on-scroll`}>
        <div className={styles.valueGrid}>
          <div className={styles.valueCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}>🎓</div>
              <h3>For Students & Candidates</h3>
            </div>
            <ul className={styles.detailList}>
              <li><strong>Interactive Tracking:</strong> Real-time visibility into your journey.</li>
              <li><strong>Direct HR Bridge:</strong> Secure, direct communication channel.</li>
              <li><strong>Skill Mapping:</strong> Align profile with global sector needs.</li>
            </ul>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}>💼</div>
              <h3>For Recruiters & HR Teams</h3>
            </div>
            <ul className={styles.detailList}>
              <li><strong>Journey Manager:</strong> Automated one-click candidate status updates.</li>
              <li><strong>JD Extraction:</strong> Instant .txt to database mapping.</li>
              <li><strong>PDF Engine:</strong> Legal-grade offer letters in under 10 seconds.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: ANALYTICS */}
      <section className={`${styles.analyticsSection} reveal-on-scroll`}>
        <div className={styles.glassTerminalLarge}>
          <div className={styles.terminalHeader}>
            <div className={styles.dots}><span/><span/><span/></div>
            <span className={styles.terminalLabel}>MULTI-SECTOR VACANCY GROWTH ANALYSIS</span>
          </div>
          
          <div className={styles.terminalBody}>
            <div className={styles.mainChartBox}>
              <div className={styles.chartHeader}>
                <h4>Global Job Opening Surge by Industry (2020-2026)</h4>
                <p>Visualization of market demand trends across fiscal years.</p>
              </div>
              
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={sectorTrendData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#64748b'}}
                      label={{ value: 'FISCAL YEAR', position: 'bottom', offset: 10, fontSize: 12, fontWeight: 800, fill: '#94a3b8' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 12, fill: '#64748b'}}
                      label={{ value: 'NUMBER OF OPENINGS', angle: -90, position: 'insideLeft', offset: -25, fontSize: 12, fontWeight: 800, fill: '#94a3b8' }}
                    />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="top" align="right" height={40} iconType="circle" />
                    <Line name="Tech & AI" type="monotone" dataKey="tech" stroke="#2563eb" strokeWidth={4} dot={{r:4}} />
                    <Line name="Healthcare" type="monotone" dataKey="health" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" />
                    <Line name="Finance" type="monotone" dataKey="finance" stroke="#f59e0b" strokeWidth={3} />
                    <Line name="Energy" type="monotone" dataKey="energy" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPACT TWO-PART FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTopRow}>
            {/* PART 1: BRANDING & DESC */}
            <div className={styles.footerBrandBlock}>
              <div className={styles.footerLogo}>Modern<span>HR</span></div>
              <p>Providing enterprise-grade workforce solutions for the modern era.</p>
              <p>Streamlining recruitment through data intelligence and automation.</p>
            </div>

            {/* PART 2: CONTACT DETAILS */}
           
          </div>

          <div className={styles.footerBottomBar}>
            <p>© 2026 ModernHR Global Inc. | Professional ERP Grade Architecture</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;