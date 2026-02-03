import React, { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Tree parameters
    const trees = [];
    const numTrees = 8;

    class PhylogeneticTree {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.branches = [];
        this.generateTree(x, y, -90, 120, 6);
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      generateTree(x, y, angle, length, depth) {
        if (depth === 0) return;

        const endX = x + Math.cos(angle * Math.PI / 180) * length;
        const endY = y + Math.sin(angle * Math.PI / 180) * length;

        this.branches.push({ x1: x, y1: y, x2: endX, y2: endY, depth });

        const newLength = length * 0.7;
        const angleVariation = 25 + Math.random() * 15;

        this.generateTree(endX, endY, angle - angleVariation, newLength, depth - 1);
        this.generateTree(endX, endY, angle + angleVariation, newLength, depth - 1);
      }

      draw(ctx) {
        this.branches.forEach(branch => {
          ctx.strokeStyle = `rgba(100, 150, 200, ${this.opacity * (branch.depth / 6)})`;
          ctx.lineWidth = branch.depth * 0.5;
          ctx.beginPath();
          ctx.moveTo(branch.x1, branch.y1);
          ctx.lineTo(branch.x2, branch.y2);
          ctx.stroke();
        });
      }
    }

    // Generate trees
    for (let i = 0; i < numTrees; i++) {
      trees.push(new PhylogeneticTree(
        Math.random() * canvas.width,
        canvas.height - Math.random() * 100
      ));
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trees.forEach(tree => tree.draw(ctx));
      requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{
      margin: 0,
      padding: 0,
      height: '100vh',
      backgroundColor: '#0a0e1a',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />

      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '300',
            margin: '0 0 15px 0',
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Sven Kasser
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#8fa3bf',
            fontWeight: '300',
            letterSpacing: '0.1em',
            margin: 0
          }}>
            Evolutionary Anthropology | Computational Genomics
          </p>
        </div>

        {/* DNA Navigation */}
        <DNANavigation />
      </div>
    </div>
  );
}

function DNANavigation() {
  const [rotation, setRotation] = React.useState(0);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { label: 'Research', angle: 0 },
    { label: 'Writings', angle: 90 },
    { label: 'Resume', angle: 180 },
    { label: 'Contact', angle: 270 }
  ];

  const helixHeight = 320;
  const helixRadius = 65;
  const centerY = 0;

  return (
    <div style={{
      position: 'relative',
      width: `${helixRadius * 2 + 200}px`,
      height: `${helixHeight}px`
    }}>
      <svg
        width={helixRadius * 2 + 200}
        height={helixHeight}
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <defs>
          <linearGradient id="strandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a9eff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#4a9eff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4a9eff" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Left strand */}
        <path
          d={`M ${100 + helixRadius} ${centerY + helixHeight/2} ${
            Array.from({ length: 100 }, (_, i) => {
              const t = i / 99;
              const y = centerY + helixHeight/2 - helixHeight/2 + t * helixHeight;
              const angle = rotation + t * 720;
              const x = 100 + helixRadius + Math.sin(angle * Math.PI / 180) * helixRadius;
              return `L ${x} ${y}`;
            }).join(' ')
          }`}
          fill="none"
          stroke="url(#strandGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right strand */}
        <path
          d={`M ${100 + helixRadius} ${centerY + helixHeight/2} ${
            Array.from({ length: 100 }, (_, i) => {
              const t = i / 99;
              const y = centerY + helixHeight/2 - helixHeight/2 + t * helixHeight;
              const angle = rotation + t * 720 + 180;
              const x = 100 + helixRadius + Math.sin(angle * Math.PI / 180) * helixRadius;
              return `L ${x} ${y}`;
            }).join(' ')
          }`}
          fill="none"
          stroke="url(#strandGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Base pairs */}
        {Array.from({ length: 20 }, (_, i) => {
          const t = i / 19;
          const y = centerY + helixHeight/2 - helixHeight/2 + t * helixHeight;
          const angle1 = rotation + t * 720;
          const angle2 = angle1 + 180;
          const x1 = 100 + helixRadius + Math.sin(angle1 * Math.PI / 180) * helixRadius;
          const x2 = 100 + helixRadius + Math.sin(angle2 * Math.PI / 180) * helixRadius;

          return (
            <line
              key={i}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="#4a9eff"
              strokeWidth="1.5"
              opacity="0.4"
            />
          );
        })}
      </svg>

      {/* Menu items */}
      {menuItems.map((item, index) => {
        const t = 0.5;
        const y = centerY + helixHeight/2 - helixHeight/2 + t * helixHeight;
        const angle = rotation + t * 720 + item.angle;
        const x = 100 + helixRadius + Math.sin(angle * Math.PI / 180) * helixRadius;
        const z = Math.cos(angle * Math.PI / 180);
        const isHovered = hoveredIndex === index;

        return (
          <button
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
              background: isHovered 
                ? 'rgba(74, 158, 255, 0.25)'
                : z > 0 
                  ? 'rgba(74, 158, 255, 0.15)' 
                  : 'rgba(74, 158, 255, 0.08)',
              border: `2px solid ${isHovered ? '#6eb5ff' : 'rgba(74, 158, 255, 0.4)'}`,
              color: '#ffffff',
              padding: '14px 28px',
              fontSize: '0.95rem',
              fontWeight: '400',
              letterSpacing: '0.08em',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: z > 0 ? 1 : 0.5,
              zIndex: z > 0 ? 10 : 5,
              backdropFilter: 'blur(10px)',
              boxShadow: isHovered 
                ? '0 8px 32px rgba(74, 158, 255, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.2)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default App;
