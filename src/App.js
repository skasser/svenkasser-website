import React, { useState, useEffect } from 'react';

// Double Helix Menu Component
function DoubleHelixMenu({ rotation, expanded, onToggle }) {
  const menuItems = ['Research', 'Writings', 'Resume', 'Contact'];
  const numPoints = 16;
  const radius = 25;
  const height = 80;

  const points = Array.from({ length: numPoints }, (_, i) => {
    const t = (i / numPoints) * Math.PI * 2.5;
    const angle = t + (rotation * Math.PI / 180);

    return {
      strand1: {
        x: 100 + Math.cos(angle) * radius,  // Centered at x=100 in 200px container
        y: (i / numPoints) * height + 60,
        z: Math.sin(angle),
      },
      strand2: {
        x: 100 + Math.cos(angle + Math.PI) * radius,  // Centered at x=100 in 200px container
        y: (i / numPoints) * height + 60,
        z: Math.sin(angle + Math.PI),
      },
    };
  });

  // Assign menu items to specific helix positions
  const labelPositions = [3, 6, 9, 12];

  return (
    <div
      className="helix-container"
      style={{
        width: expanded ? '600px' : '200px',
        height: expanded ? '130px' : '160px',  // Taller to fit horizontal helix + space for menu below
        overflow: 'visible',
        transition: 'all 0.5s ease',
        transform: expanded ? 'translateY(0)' : 'translateY(0)',  // No vertical offset
      }}
    >
      {/* Wrapper for helix that centers and rotates */}
      <div
        className="helix-wrapper"
        onClick={onToggle}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '200px',
          height: '160px',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: expanded
            ? 'translateX(200px) translateY(-20px) rotate(90deg)'  // Moved up 20px
            : 'translateX(0) translateY(0) rotate(0deg)',
          transformOrigin: '100px 100px',  // Visual center of helix (x=100, y=60+40=100)
          cursor: 'pointer'
        }}
      >
      <svg
        width="200"
        height="160"
        className="absolute"
        style={{
          left: 0,
          top: 0
        }}
      >
        {/* Connectors (base pairs) */}
        {points.slice(0, -1).filter((_, i) => i % 2 === 0).map((point, i) => (
          <line
            key={`connector-${i}`}
            x1={point.strand1.x}
            y1={point.strand1.y}
            x2={point.strand2.x}
            y2={point.strand2.y}
            stroke="url(#gradient)"
            strokeWidth="2"
            opacity={0.2 + (Math.max(point.strand1.z, point.strand2.z) + 1) * 0.15}
          />
        ))}

        {/* Strand 1 connections */}
        {points.slice(0, -1).map((point, i) => (
          <line
            key={`strand1-${i}`}
            x1={point.strand1.x}
            y1={point.strand1.y}
            x2={points[i + 1].strand1.x}
            y2={points[i + 1].strand1.y}
            stroke="#10b981"
            strokeWidth="3"
            opacity={0.4 + (point.strand1.z + 1) * 0.3}
            strokeLinecap="round"
          />
        ))}

        {/* Strand 2 connections */}
        {points.slice(0, -1).map((point, i) => (
          <line
            key={`strand2-${i}`}
            x1={point.strand2.x}
            y1={point.strand2.y}
            x2={points[i + 1].strand2.x}
            y2={points[i + 1].strand2.y}
            stroke="#3b82f6"
            strokeWidth="3"
            opacity={0.4 + (point.strand2.z + 1) * 0.3}
            strokeLinecap="round"
          />
        ))}

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Base pairs as horizontal bars */}
      {points.filter((_, i) => i % 2 === 0).map((point, i) => {
        const avgZ = (point.strand1.z + point.strand2.z) / 2;
        const opacity = 0.4 + (avgZ + 1) * 0.3;
        const width = Math.abs(point.strand2.x - point.strand1.x);
        const leftX = Math.min(point.strand1.x, point.strand2.x);

        return (
          <div
            key={`bar-${i}`}
            className="helix-bar"
            style={{
              left: `${leftX}px`,
              top: `${point.strand1.y}px`,
              width: `${width}px`,
              height: '3px',
              background: 'linear-gradient(90deg, #10b981, #3b82f6)',
              opacity: opacity,
              position: 'absolute',
              zIndex: Math.round((avgZ + 1) * 10),
              transition: 'opacity 0.3s ease',
            }}
          />
        );
      })}
      </div> {/* Close helix-wrapper */}

      {/* Menu labels - floating animation */}
      {points.map((point, i) => {
        const hasLabel = labelPositions.includes(i);
        const labelIndex = labelPositions.indexOf(i);

        if (!hasLabel) return null;

        const useStrand = point.strand1.z > point.strand2.z ? 'strand1' : 'strand2';
        const activePoint = point[useStrand];
        const isVisible = activePoint.z > -0.3;

        // Calculate collapsed position (near helix but farther out)
        const collapsedX = activePoint.x > 100 ? activePoint.x + 50 : activePoint.x - 50;
        const collapsedY = activePoint.y;

        // Calculate expanded position - centered within the 600px helix-container
        // Research to Writings: 155px, Writings to Resume: 185px (helix space), Resume to Contact: 155px
        const positions = [
          54.5,   // Research (shifted 1px left)
          209.5,  // Writings (155px from Research)
          394.5,  // Resume (185px from Writings - extra space for helix)
          549.5   // Contact (155px from Resume)
        ];
        const expandedX = positions[labelIndex];
        const expandedY = 70;  // Moved up 20px (was 90)

        return (
          <a
            key={`label-${i}`}
            href={`#${menuItems[labelIndex].toLowerCase()}`}
            className={`nav-label-floating ${expanded ? 'expanded' : ''}`}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: expanded
                ? `translate(${expandedX}px, ${expandedY}px) translateX(-50%)`  // Center text on position
                : `translate(${collapsedX}px, ${collapsedY}px) scale(${0.85 + (activePoint.z + 1) * 0.15})`,
              opacity: expanded ? 1 : (isVisible ? 0.5 + (activePoint.z + 1) * 0.4 : 0),
              pointerEvents: expanded || isVisible ? 'auto' : 'none',
              color: expanded ? '#cbd5e1' : '#fb923c',
              textShadow: expanded ? 'none' : '0 0 8px rgba(251, 146, 60, 0.6)',
              zIndex: Math.round((activePoint.z + 1) * 10 + 100),
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), color 0.6s cubic-bezier(0.4, 0, 0.2, 1), text-shadow 0.3s ease',
            }}
          >
            {menuItems[labelIndex]}
          </a>
        );
      })}
    </div>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [menuExpanded, setMenuExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Continuous rotation for helix - always spinning
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-100 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=IBM+Plex+Mono:wght@300;400;500&family=Space+Grotesk:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Space Grotesk', sans-serif;
          overflow-x: hidden;
        }

        .gradient-text {
          background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .glow {
          text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }

        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #10b981, #3b82f6);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .section-fade-in {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.8s; }

        .code-accent {
          font-family: 'IBM Plex Mono', monospace;
          color: #10b981;
          font-weight: 400;
        }

        .code-accent-orange {
          font-family: 'IBM Plex Mono', monospace;
          color: #fb923c;
          font-weight: 400;
        }

        .hover\\:text-orange-400:hover {
          color: #fb923c;
        }

        .hover\\:border-orange-400:hover {
          border-color: #fb923c;
        }

        .hover\\:bg-orange-500\\/10:hover {
          background-color: rgba(249, 115, 22, 0.1);
        }

        .card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.2);
          transition: all 0.3s ease;
        }

        .card:hover {
          border-color: rgba(16, 185, 129, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 10px 40px rgba(16, 185, 129, 0.2);
        }

        .card-orange {
          border: 1px solid rgba(251, 146, 60, 0.2);
        }

        .card-orange:hover {
          border-color: rgba(251, 146, 60, 0.5);
          box-shadow: 0 10px 40px rgba(251, 146, 60, 0.2);
        }

        .bg-gradient-to-br {
          background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
        }

        .from-blue-500 {
          --tw-gradient-from: #3b82f6;
          --tw-gradient-to: rgba(59, 130, 246, 0);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }

        .to-orange-400 {
          --tw-gradient-to: #fb923c;
        }

        .helix-container {
          position: relative;
          /* width and height now set inline dynamically */
        }

        .helix-strand {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .helix-bar {
          border-radius: 2px;
        }

        .helix-connector {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, #10b981, #3b82f6);
          transform-origin: left center;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .nav-label {
          position: absolute;
          font-size: 0.75rem;
          white-space: nowrap;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-decoration: none;
          cursor: pointer;
        }

        .nav-label-floating {
          position: absolute;
          font-size: 0.875rem;
          white-space: nowrap;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-decoration: none;
          cursor: pointer;
        }

        .nav-label-floating::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #10b981, #3b82f6);
          transition: width 0.3s ease;
        }

        .nav-label-floating.expanded:hover {
          color: #f1f5f9 !important;
          text-shadow: 0 0 12px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.3);
        }

        .nav-label-floating.expanded:hover::after {
          width: 100%;
        }

        .nav-label:hover {
          text-shadow: 0 0 10px currentColor;
          transform: scale(1.1) !important;
        }

        .helix-container:hover .helix-bar {
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
        }

        .helix-container:hover .helix-connector {
          opacity: 1;
        }

        .min-h-screen {
          min-height: 100vh;
        }

        .from-slate-950 {
          --tw-gradient-from: #020617;
          --tw-gradient-to: rgba(2, 6, 23, 0);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }

        .via-slate-900 {
          --tw-gradient-to: rgba(15, 23, 42, 0);
          --tw-gradient-stops: var(--tw-gradient-from), #0f172a, var(--tw-gradient-to);
        }

        .to-emerald-950 {
          --tw-gradient-to: #022c22;
        }

        .text-slate-100 {
          color: #f1f5f9;
        }

        .overflow-hidden {
          overflow: hidden;
        }

        .fixed {
          position: fixed;
        }

        .inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .pointer-events-none {
          pointer-events: none;
        }

        .absolute {
          position: absolute;
        }

        .relative {
          position: relative;
        }

        .top-0 {
          top: 0;
        }

        .left-0 {
          left: 0;
        }

        .right-0 {
          right: 0;
        }

        .z-50 {
          z-index: 50;
        }

        .transition-all {
          transition-property: all;
        }

        .duration-300 {
          transition-duration: 300ms;
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }

        .border-b {
          border-bottom-width: 1px;
        }

        .max-w-6xl {
          max-width: 72rem;
        }

        .max-w-4xl {
          max-width: 56rem;
        }

        .max-w-2xl {
          max-width: 42rem;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        .px-6 {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }

        .py-1 {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }

        .py-12 {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }

        .py-32 {
          padding-top: 8rem;
          padding-bottom: 8rem;
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .justify-center {
          justify-content: center;
        }

        .justify-between {
          justify-content: space-between;
        }

        .gap-3 {
          gap: 0.75rem;
        }

        .gap-6 {
          gap: 1.5rem;
        }

        .gap-8 {
          gap: 2rem;
        }

        .grid {
          display: grid;
        }

        .rounded-lg {
          border-radius: 0.5rem;
        }

        .rounded-xl {
          border-radius: 0.75rem;
        }

        .p-8 {
          padding: 2rem;
        }

        .mb-3 {
          margin-bottom: 0.75rem;
        }

        .mb-4 {
          margin-bottom: 1rem;
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        .mb-12 {
          margin-bottom: 3rem;
        }

        .mt-8 {
          margin-top: 2rem;
        }

        .mt-12 {
          margin-top: 3rem;
        }

        .mt-16 {
          margin-top: 4rem;
        }

        .w-full {
          width: 100%;
        }

        .w-5 {
          width: 1.25rem;
        }

        .w-6 {
          width: 1.5rem;
        }

        .w-12 {
          width: 3rem;
        }

        .h-5 {
          height: 1.25rem;
        }

        .h-6 {
          height: 1.5rem;
        }

        .h-12 {
          height: 3rem;
        }

        .text-sm {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }

        .text-xl {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }

        .text-2xl {
          font-size: 1.5rem;
          line-height: 2rem;
        }

        .text-4xl {
          font-size: 2.25rem;
          line-height: 2.5rem;
        }

        .text-7xl {
          font-size: 4.5rem;
          line-height: 1;
        }

        .font-bold {
          font-weight: 700;
        }

        .font-semibold {
          font-weight: 600;
        }

        .font-medium {
          font-weight: 500;
        }

        .font-light {
          font-weight: 300;
        }

        .tracking-widest {
          letter-spacing: 0.1em;
        }

        .leading-relaxed {
          line-height: 1.625;
        }

        .text-slate-300 {
          color: #cbd5e1;
        }

        .text-slate-400 {
          color: #94a3b8;
        }

        .text-slate-500 {
          color: #64748b;
        }

        .text-slate-600 {
          color: #475569;
        }

        .border {
          border-width: 1px;
        }

        .border-t {
          border-top-width: 1px;
        }

        .border-slate-600 {
          border-color: #475569;
        }

        .border-slate-800 {
          border-color: #1e293b;
        }

        .bg-gradient-to-r {
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
        }

        .from-emerald-600 {
          --tw-gradient-from: #059669;
          --tw-gradient-to: rgba(5, 150, 105, 0);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }

        .to-emerald-500 {
          --tw-gradient-to: #10b981;
        }

        .from-emerald-500 {
          --tw-gradient-from: #10b981;
          --tw-gradient-to: rgba(16, 185, 129, 0);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }

        .to-emerald-400 {
          --tw-gradient-to: #34d399;
        }

        .hover\\:from-emerald-500:hover {
          --tw-gradient-from: #10b981;
          --tw-gradient-to: rgba(16, 185, 129, 0);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }

        .hover\\:to-emerald-400:hover {
          --tw-gradient-to: #34d399;
        }

        .hover\\:shadow-lg:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .hover\\:shadow-emerald-500\\/50:hover {
          --tw-shadow-color: rgba(16, 185, 129, 0.5);
        }

        .transform {
          transform: translateX(0);
        }

        .hover\\:-translate-y-0\\.5:hover {
          transform: translateY(-0.125rem);
        }

        .block {
          display: block;
        }

        @media (min-width: 768px) {
          .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .md\\:text-8xl {
            font-size: 6rem;
            line-height: 1;
          }

          .md\\:text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }
        }
      `}</style>

      {/* Infinite Phylogenetic Tree Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg width="100%" height="200%" className="absolute inset-0 phylo-tree-scroll" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 2000">
          <defs>
            <linearGradient id="branchGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Repeating tree pattern with convergence for smooth loop */}
          <g opacity="0.4" stroke="url(#branchGradient)" fill="none" strokeLinecap="round">
            {/* === FIRST SECTION === */}
            {/* Single trunk at base (starting point) */}
            <path d="M 500 1000 L 500 900" strokeWidth="2.5" opacity="0.6" />

            {/* First bifurcation */}
            <path d="M 500 900 L 350 750 M 500 900 L 650 750" strokeWidth="2" />

            {/* Secondary branches */}
            <path d="M 350 750 L 250 600 M 350 750 L 380 600" strokeWidth="1.5" />
            <path d="M 650 750 L 750 600 M 650 750 L 620 600" strokeWidth="1.5" />

            {/* Tertiary branches */}
            <path d="M 250 600 L 180 450 M 250 600 L 280 450" strokeWidth="1" />
            <path d="M 380 600 L 340 450 M 380 600 L 420 450" strokeWidth="1" />
            <path d="M 750 600 L 820 450 M 750 600 L 720 450" strokeWidth="1" />
            <path d="M 620 600 L 660 450 M 620 600 L 580 450" strokeWidth="1" />

            {/* Terminal branches */}
            <path d="M 180 450 L 140 300 M 180 450 L 200 300" strokeWidth="0.8" />
            <path d="M 280 450 L 260 300 M 280 450 L 310 300" strokeWidth="0.8" />
            <path d="M 340 450 L 320 300 M 340 450 L 370 300" strokeWidth="0.8" />
            <path d="M 420 450 L 400 300 M 420 450 L 450 300" strokeWidth="0.8" />
            <path d="M 820 450 L 860 300 M 820 450 L 800 300" strokeWidth="0.8" />
            <path d="M 720 450 L 740 300 M 720 450 L 690 300" strokeWidth="0.8" />
            <path d="M 660 450 L 680 300 M 660 450 L 630 300" strokeWidth="0.8" />
            <path d="M 580 450 L 600 300 M 580 450 L 550 300" strokeWidth="0.8" />

            {/* === SECOND SECTION (identical for seamless loop) === */}
            <path d="M 500 2000 L 500 1900" strokeWidth="2.5" opacity="0.6" />
            <path d="M 500 1900 L 350 1750 M 500 1900 L 650 1750" strokeWidth="2" />
            <path d="M 350 1750 L 250 1600 M 350 1750 L 380 1600" strokeWidth="1.5" />
            <path d="M 650 1750 L 750 1600 M 650 1750 L 620 1600" strokeWidth="1.5" />
            <path d="M 250 1600 L 180 1450 M 250 1600 L 280 1450" strokeWidth="1" />
            <path d="M 380 1600 L 340 1450 M 380 1600 L 420 1450" strokeWidth="1" />
            <path d="M 750 1600 L 820 1450 M 750 1600 L 720 1450" strokeWidth="1" />
            <path d="M 620 1600 L 660 1450 M 620 1600 L 580 1450" strokeWidth="1" />
            <path d="M 180 1450 L 140 1300 M 180 1450 L 200 1300" strokeWidth="0.8" />
            <path d="M 280 1450 L 260 1300 M 280 1450 L 310 1300" strokeWidth="0.8" />
            <path d="M 340 1450 L 320 1300 M 340 1450 L 370 1300" strokeWidth="0.8" />
            <path d="M 420 1450 L 400 1300 M 420 1450 L 450 1300" strokeWidth="0.8" />
            <path d="M 820 1450 L 860 1300 M 820 1450 L 800 1300" strokeWidth="0.8" />
            <path d="M 720 1450 L 740 1300 M 720 1450 L 690 1300" strokeWidth="0.8" />
            <path d="M 660 1450 L 680 1300 M 660 1450 L 630 1300" strokeWidth="0.8" />
            <path d="M 580 1450 L 600 1300 M 580 1450 L 550 1300" strokeWidth="0.8" />
          </g>

          {/* Subtle pulsing nodes */}
          <g>
            <circle cx="140" cy="400" r="2" fill="#10b981" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="450" cy="400" r="2" fill="#10b981" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="7s" repeatCount="indefinite" />
            </circle>
            <circle cx="860" cy="400" r="2" fill="#10b981" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="8s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>

        <style>{`
          .phylo-tree-scroll {
            animation: scrollTree 60s linear infinite;
          }

          @keyframes scrollTree {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }
        `}</style>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-gradient-to-r from-emerald-900/80 via-slate-900/80 to-blue-900/80 backdrop-blur-md border-b border-emerald-500/30' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-1 flex items-center justify-center" style={{ transition: 'all 0.5s ease' }}>
          {/* Double Helix Menu */}
          <div className="relative" style={{
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <DoubleHelixMenu
              rotation={rotation}
              expanded={menuExpanded}
              onToggle={() => setMenuExpanded(!menuExpanded)}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            <div className="section-fade-in delay-1">
              <p className="code-accent-orange text-sm mb-4 tracking-widest">POSTDOCTORAL SCHOLAR</p>
            </div>

            <h1 className="section-fade-in delay-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-7xl md:text-8xl font-bold block mb-4">
                Sven Kasser
              </span>
              <span className="text-2xl md:text-3xl font-light text-slate-400 block">
                Evolutionary Anthropology | Computational Genomics
              </span>
            </h1>

            <div className="section-fade-in delay-3 mt-8 max-w-2xl">
              <p className="text-xl text-slate-300 leading-relaxed">
                Exploring the intersection of{' '}
                <span className="gradient-text font-semibold">cultural</span> and{' '}
                <span className="gradient-text font-semibold">genetic evolution</span> in humans
                through computational approaches.
              </p>
            </div>

            <div className="section-fade-in delay-4 mt-12 flex gap-6">
              <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 transform hover:-translate-y-0.5">
                View Research
              </button>
              <button className="px-8 py-3 border border-slate-600 hover:border-orange-400 rounded-lg font-medium transition-all duration-300 hover:bg-orange-500/10">
                Get in Touch
              </button>
            </div>

            {/* Affiliation */}
            <div className="section-fade-in delay-4 mt-16 flex items-center gap-3 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="code-accent-orange text-sm">UC Davis</span>
              <span className="text-slate-600">·</span>
              <span className="text-sm">Genome Center & Center for Population Biology</span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-32 px-6 relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
              Research Focus
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-8 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Genetic Evolution</h3>
                <p className="text-slate-400 leading-relaxed">
                  Leveraging computational genomics to understand human genetic variation and adaptation across populations.
                </p>
              </div>

              <div className="card card-orange p-8 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Cultural Evolution</h3>
                <p className="text-slate-400 leading-relaxed">
                  Integrating anthropological perspectives to explore how culture and genes co-evolve in human societies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2026 Sven Kasser
          </p>
          <div className="flex gap-6">
            {['Email', 'GitHub', 'ORCID', 'Google Scholar'].map((link, index) => (
              <a
                key={link}
                href="#"
                className={`text-slate-500 text-sm transition-colors duration-300 ${
                  index % 2 === 0 ? 'hover:text-orange-400' : 'hover:text-emerald-400'
                }`}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
