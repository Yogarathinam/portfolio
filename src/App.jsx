import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Cpu, Bot, CircuitBoard, 
  Terminal, Globe, Award, Focus, Binary, Zap,
  ExternalLink, FileText, MapPin, GraduationCap, BarChart
} from 'lucide-react';

// Custom Github Icon SVG to replace the removed Lucide brand icon
const GithubIcon = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

// --- ADVANCED ANIMATION HOOKS ---
const useScrollReveal = (threshold = 0.05) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -5% 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// --- COMPONENTS ---

const FadeReveal = ({ children, delay = 0, className = "", direction = "up" }) => {
  const [ref, isVisible] = useScrollReveal();
  const translates = {
    up: "translate-y-12",
    down: "-translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
    none: "translate-y-0 translate-x-0 scale-95"
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : `opacity-0 ${translates[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Advanced Scrambling Text Effect for the Hero
const ScrambleHeading = ({ text, delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState(text.replace(/./g, ' '));
  const [ref, isVisible] = useScrollReveal();
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    if (!isVisible) return;
    
    let iteration = 0;
    let interval = null;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(text.split('').map((char, index) => {
          if (index < iteration) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));

        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 2; // Speed of decryption
      }, 30);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, isVisible]);

  return (
    <span ref={ref} className={`block ${className}`}>
      {displayText}
    </span>
  );
};

// Project Card with the Hover-Swap Effect & Interactive Links
const HoverProjectCard = ({ project, index }) => {
  return (
    <FadeReveal delay={(index % 3) * 100} className="h-full">
      <div className="relative h-[360px] bg-[#0a0a0c] border border-zinc-800 group overflow-hidden cursor-none interactive-element">
        
        {/* FRONT STATE (Default) */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-hover:scale-95 group-hover:-translate-y-8 bg-[#0a0a0c]">
          <div>
            <span className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
              {project.id} // {project.type}
            </span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mt-4 leading-[1.1]">
              {project.title}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
             <div className="font-mono text-[10px] text-[#ccff00] uppercase tracking-widest flex items-center gap-2">
              <Focus className="w-4 h-4 animate-pulse" /> Hover to decrypt & view links
            </div>
            {/* Impact Sneak Peek */}
            {project.impact && (
              <div className="font-mono text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 p-2 border-l-2 border-l-[#ccff00]">
                {project.impact}
              </div>
            )}
          </div>
        </div>

        {/* BACK STATE (Hover) */}
        <div className="absolute inset-0 p-6 md:p-8 bg-[#ccff00] flex flex-col justify-between z-20 opacity-0 translate-y-12 scale-105 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
          <div>
            <h4 className="font-black text-black uppercase tracking-tighter text-xl mb-3 leading-tight">{project.title}</h4>
            <p className="text-black/80 font-medium text-xs md:text-sm leading-relaxed mb-4">
              {project.desc}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.specs.map(spec => (
                <span key={spec} className="px-2 py-1 text-[9px] md:text-[10px] font-mono border border-black/20 text-black uppercase tracking-widest bg-black/5">
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          {/* Action Links Container (Clickable) */}
          <div className="flex items-center gap-3 relative z-30 pointer-events-auto">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest border-2 border-black px-3 py-2 hover:bg-black hover:text-[#ccff00] transition-colors cursor-none interactive-element">
                <GithubIcon className="w-3 h-3 md:w-4 md:h-4" /> Source
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest border-2 border-black bg-black text-[#ccff00] px-3 py-2 hover:bg-transparent hover:text-black transition-colors cursor-none interactive-element">
                <ExternalLink className="w-3 h-3 md:w-4 md:h-4" /> Demo
              </a>
            )}
            {!project.github && !project.live && (
               <span className="text-[10px] font-mono font-bold uppercase text-black/50 border border-black/10 px-3 py-2">
                 Internal / Offline Build
               </span>
            )}
          </div>
        </div>

      </div>
    </FadeReveal>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const cursorRef = useRef(null);
  const requestRef = useRef(null);
  const mousePosition = useRef({ x: -100, y: -100 }); // Target
  const cursorPosition = useRef({ x: -100, y: -100 }); // Current animated
  const [isHovering, setIsHovering] = useState(false);

  // Global mouse tracking optimized with Lerp (Linear Interpolation) for fluid smoothness
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Update hovering state only for CSS styling changes
      const target = e.target;
      const isInteractive = target.closest('a') || target.closest('button') || target.closest('.interactive-element');
      
      setIsHovering(!!isInteractive);
    };

    const animateCursor = () => {
      // Lerp formula: current = current + (target - current) * friction
      cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * 0.15;
      cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px)`;
      }

      requestRef.current = requestAnimationFrame(animateCursor);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // COMPILED PROJECTS WITH ACTUAL LINKS AND IMPACT
  const projects = [
    {
      id: "SYS.01", title: "LEETBOT SAAS", type: "Full-Stack Automation",
      specs: ["Chrome API", "React", "Node.js", "MongoDB", "Monaco Injection"],
      desc: "Fully automated Chrome extension solving complex coding problems by injecting logic into the DOM. Backed by a full Node/MongoDB SaaS credit-billing system.",
      impact: "Handled extensive automated DOM injections bypassing standard limits.",
      github: "https://github.com/Yogarathinam/leetcoder-2025"
    },
    {
      id: "SYS.02", title: "PROCTIFY PORTAL", type: "Networking & Web",
      specs: ["TypeScript", "React", "Node.js", "WebRTC"],
      desc: "Robust online MCQ platform with user authentication, test management, and automated evaluation.",
      impact: "Successfully used and tested by 100+ students for real-time assessment.",
      github: "https://github.com/Yogarathinam/proctify_portal_frontend"
    },
    {
      id: "SYS.03", title: "BRAILLEX HMI", type: "Hardware & Accessibility",
      specs: ["Java", "Android", "TTS API", "Hardware Logic", "Gesture UI"],
      desc: "Tactile touch-based Braille input system featuring a 6-dot virtual mechanism, real-time audio TTS feedback, and custom gesture actions for the visually impaired.",
      impact: "Designed specifically for real usability with zero-friction blind-friendly UX.",
      github: "https://github.com/Yogarathinam/braillex-Blind-Assistive-System"
    },
    {
      id: "SYS.04", title: "AI SHOP FLOOR SAFETY", type: "Computer Vision & Edge",
      specs: ["OpenCV", "Microcontrollers", "Python", "Alert System"],
      desc: "PPE violation detection system processing video frames in real-time. Integrated directly with a microcontroller-based alert system for industrial environments.",
      impact: "Won 1st Prize at 24-Hour Dev Arena Hackathon.",
      github: "https://github.com/Yogarathinam/AIVA-autonomous-saftey-system"
    },
    {
      id: "SYS.05", title: "AI AUTO-ANSWER", type: "Smart Browser Tool",
      specs: ["Gemini API", "Prompt Engineering", "DOM Parsing", "JS"],
      desc: "Intelligent extension that autonomously parses webpage DOMs, categorizes inputs (MCQ vs Descriptive), and injects context-aware answers utilizing LLM APIs.",
      impact: "Fully automated pipeline with smart dual-prompt fallback capabilities.",
      github: "https://github.com/Yogarathinam/Gemini-Auto-Solver"
    },
    {
      id: "SYS.06", title: "ADAPTIVE RC SYSTEM", type: "Robotics Control",
      specs: ["ESP32", "L293D Motors", "Voice Commands", "Camera Feed"],
      desc: "Adaptive control system for a robotics chassis featuring multilingual voice command execution, autonomous obstacle detection, and a live web-camera interface.",
      impact: "Achieved seamless WSAD web integration with active obstacle avoidance.",
      github: "https://github.com/Yogarathinam/Adaptive-Control-System-For-RC-Car"
    },
    {
      id: "SYS.07", title: "PROJECT JARVIS", type: "Conversational Robotics",
      specs: ["STT/TTS APIs", "Pan-Tilt Servos", "Arduino", "LLaMA Integration"],
      desc: "Voice-interactive humanoid head. Custom software pipeline mapping voice activity detection and AI reasoning states to physical, multi-axis servo actuation.",
      impact: "Real-time multilingual (Tamil/Eng/Telugu) synchronization."
    },
    {
      id: "SYS.08", title: "LIGHTSYNC MIDI", type: "Embedded Visualization",
      specs: ["Embedded C", "ESP32", "Hardware PWM", "MIDI Protocols"],
      desc: "Embedded system synchronizing MIDI piano inputs with LED outputs. Maps complex digital signals to precise physical LED patterns for interactive learning.",
      impact: "1st Prize Winner - Big Prototype Contest. Zero perceivable latency."
    },
    {
      id: "SYS.09", title: "ECOLENS EDGE™", type: "Edge AI Computing",
      specs: ["Computer Vision", "Edge AI", "Embedded C++", "IoT Telemetry"],
      desc: "AI-powered edge device architected for sustainable waste segregation. Classifies plastic, organic, and metal waste in real-time with zero cloud processing dependency.",
      impact: "Hardware-level ML inference optimized for low latency."
    }
  ];

  return (
    <div className="custom-cursor-wrapper min-h-screen bg-[#050505] text-[#f4f4f5] font-sans selection:bg-[#ccff00] selection:text-black overflow-x-hidden">
      
      {/* Magnetic Box Cursor - Now optimized for smooth fluid trailing */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      >
        {/* Inner div manages the stylistic transitions without delaying the position tracking */}
        <div className={`flex items-center justify-center border-2 border-[#ccff00] rounded-none transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2 ${
            isHovering ? 'w-12 h-12 bg-[#ccff00]/20 backdrop-blur-sm scale-110' : 'w-6 h-6'
        }`}>
          <div className={`bg-[#ccff00] transition-all duration-300 ${isHovering ? 'w-2 h-2 opacity-50' : 'w-1 h-1'}`}></div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      {/* TOP NAV */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center font-mono text-[10px] md:text-xs uppercase tracking-widest text-zinc-400 p-4 md:px-8">
          <div className="flex items-center gap-3 text-[#ccff00] font-bold">
            <Binary className="w-4 h-4" />
            <span>Yogarathinam.TL</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/resume.pdf" target="_blank" className="hidden md:inline-flex items-center gap-2 border border-[#ccff00] text-[#ccff00] px-3 py-1 hover:bg-[#ccff00] hover:text-black transition-colors cursor-none interactive-element">
              <FileText className="w-3 h-3" />
              DOWNLOAD RESUME
            </a>
            <span className="text-zinc-600 border border-zinc-800 px-2 py-1 bg-zinc-950">EST. 2026</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto min-h-screen flex flex-col">
        
        {/* HERO SECTION */}
        <section className="min-h-[100svh] pt-32 pb-16 px-4 md:px-8 flex flex-col justify-center border-b border-zinc-900 relative overflow-hidden">
          
          {/* --- NEW: Leaning Pose Image --- */}
          <div className="absolute bottom-0 right-0 md:-right-8 lg:-right-48 h-[60%] md:h-[85%] lg:h-[75%] z-0 pointer-events-none flex justify-end">
            <FadeReveal delay={1200} className="h-full w-full">
              <img 
                src="https://raw.githubusercontent.com/Yogarathinam/portfolio/main/public/wallpose.png" 
                alt="Yogarathinam - System Integrator" 
                className="h-full w-auto object-contain object-right-bottom opacity-50 md:opacity-80 grayscale contrast-125 drop-shadow-[-10px_0_30px_rgba(204,255,0,0.15)] scale-110 lg:scale-125 origin-bottom-right"
              />
            </FadeReveal>
          </div>

          <div className="w-full mb-8 z-10 cursor-default relative">
            <h1 className="flex flex-col font-black uppercase tracking-tighter leading-[0.85] text-[clamp(3.5rem,11vw,12rem)] w-full">
              <ScrambleHeading text="HARDWARE." delay={100} className="text-white" />
              <ScrambleHeading text="SOFTWARE." delay={600} className="text-transparent [-webkit-text-stroke:1px_#52525b] md:[-webkit-text-stroke:2px_#52525b]" />
              <ScrambleHeading text="SYSTEMS." delay={1100} className="text-[#ccff00]" />
            </h1>
          </div>

          <FadeReveal delay={1500} className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-end border-t border-zinc-900 pt-8 mt-auto z-10">
            <div className="w-full lg:w-1/3">
              <div className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#ccff00] pl-3">
                Core Identity
              </div>
              <h2 className="text-base md:text-xl font-bold uppercase tracking-tight text-white mb-4">
                Full-Stack Systems Integrator
              </h2>
              {/* THE HUMAN SIDE - Scannable Summary */}
              <ul className="space-y-2 font-mono text-xs text-zinc-400">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ccff00]" /> Chennai, Tamil Nadu</li>
                <li className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#ccff00]" /> ECE Undergrad @ RMD Engineering</li>
                <li className="flex items-center gap-2"><BarChart className="w-4 h-4 text-[#ccff00]" /> Proven Hackathon Winner (CGPA: 7.96)</li>
              </ul>
            </div>
            
            <div className="w-full lg:w-2/3 relative z-20">
              <p className="text-sm md:text-lg font-medium text-zinc-400 leading-relaxed max-w-4xl mb-8">
                I am driven by an insatiable curiosity to learn how things work, and an absolute obsession with making them work better. I operate at the intersection of raw hardware (circuits, kinetics), artificial intelligence, and full-stack software architecture.
              </p>
              
              {/* HARD-HITTING CTAS */}
              <div className="flex flex-wrap gap-4">
                <a href="#resume" className="flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-none interactive-element">
                  <FileText className="w-4 h-4" /> View Resume
                </a>
                <a href="https://github.com/Yogarathinam" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-zinc-700 text-white px-6 py-3 font-bold uppercase tracking-widest hover:border-[#ccff00] hover:text-[#ccff00] transition-colors cursor-none interactive-element bg-[#050505]/50 backdrop-blur-sm">
                  <GithubIcon className="w-4 h-4" /> GitHub Profile
                </a>
              </div>
            </div>
          </FadeReveal>
        </section>

        {/* --- BRUTALIST QUOTE BANNER --- */}
        <section className="py-12 md:py-16 bg-[#ccff00] border-b border-zinc-900 flex items-center justify-center px-4">
           <FadeReveal>
             <h2 className="text-black font-black uppercase tracking-tighter text-xl md:text-3xl lg:text-5xl text-center max-w-5xl leading-tight">
               "A JACK OF ALL TRADES IS A MASTER OF NONE, <br className="hidden md:block"/> BUT OFTENTIMES BETTER THAN A MASTER OF ONE."
             </h2>
           </FadeReveal>
        </section>

        {/* --- SYSTEM ARCHITECTURE MATRIX --- */}
        <section className="py-24 md:py-32 px-4 md:px-8 bg-[#0a0a0c] border-b border-zinc-900">
          <FadeReveal>
            <div className="mb-16">
              <div className="font-mono text-[#ccff00] text-[10px] md:text-xs uppercase tracking-widest mb-4">
                [ Technical Specifications ]
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                System Architecture Matrix
              </h2>
            </div>
          </FadeReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
            {/* Layer 1: Physical */}
            <FadeReveal delay={0} className="bg-[#050505] p-8 md:p-10 hover:bg-[#0a0a0c] transition-colors group">
              <CircuitBoard className="w-10 h-10 text-zinc-600 group-hover:text-[#ccff00] mb-8 transition-colors" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4">Physical Layer (Hardware)</h3>
              <p className="text-zinc-500 text-sm mb-8">Engineering circuitry, sensor telemetry, and mechanical actuation from the ground up.</p>
              <div className="flex flex-wrap gap-2">
                {["ESP32 / Arduino", "Raspberry Pi", "Sensors & Actuators", "Circuit Debugging", "Soldering & PCB", "Embedded C/C++"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-[10px] font-mono border border-zinc-800 text-zinc-400 uppercase bg-zinc-950/50">{skill}</span>
                ))}
              </div>
            </FadeReveal>

            {/* Layer 2: Cognitive */}
            <FadeReveal delay={150} className="bg-[#050505] p-8 md:p-10 hover:bg-[#0a0a0c] transition-colors group">
              <Cpu className="w-10 h-10 text-zinc-600 group-hover:text-[#ccff00] mb-8 transition-colors" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4">Cognitive Layer (AI/ML)</h3>
              <p className="text-zinc-500 text-sm mb-8">Deploying localized AI models, optical character recognition, and machine vision frameworks.</p>
              <div className="flex flex-wrap gap-2">
                {["OpenCV", "Python", "OpenRouter / LLaMA", "Tesseract OCR", "Edge AI Inference", "STT / TTS APIs"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-[10px] font-mono border border-zinc-800 text-zinc-400 uppercase bg-zinc-950/50">{skill}</span>
                ))}
              </div>
            </FadeReveal>

            {/* Layer 3: Application */}
            <FadeReveal delay={300} className="bg-[#050505] p-8 md:p-10 hover:bg-[#0a0a0c] transition-colors group">
              <Globe className="w-10 h-10 text-zinc-600 group-hover:text-[#ccff00] mb-8 transition-colors" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4">Application Layer (Software)</h3>
              <p className="text-zinc-500 text-sm mb-8">Architecting SaaS platforms, DOM injection automation, and full-stack web architectures.</p>
              <div className="flex flex-wrap gap-2">
                {["Java / Android", "React & Node.js", "MongoDB", "Chrome Ext APIs", "DOM Reverse Engineering", "JWT & REST APIs"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-[10px] font-mono border border-zinc-800 text-zinc-400 uppercase bg-zinc-950/50">{skill}</span>
                ))}
              </div>
            </FadeReveal>
          </div>
        </section>

        {/* --- EXPERIENCE & AWARDS SECTION --- */}
        <section className="py-24 md:py-32 px-4 md:px-8 bg-[#050505] border-b border-zinc-900">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
            
            {/* Experience & Certs */}
            <div>
              <FadeReveal>
                <h2 className="font-mono text-[#ccff00] text-[10px] md:text-xs uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">
                  Experience & Certifications
                </h2>
              </FadeReveal>
              
              <div className="space-y-8">
                <FadeReveal delay={100}>
                  <div className="border-l-2 border-zinc-800 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-[#ccff00] rounded-full -left-[5px] top-2"></div>
                    <span className="font-mono text-xs text-zinc-500 uppercase">Jul 2025 // In-Plant Trainee</span>
                    <h3 className="text-xl font-bold uppercase text-white mt-1">Chennai Port Trust</h3>
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">Industrial exposure to heavy electrical systems, port automation, safety protocols, and large-scale power distribution mechanics.</p>
                  </div>
                </FadeReveal>

                <FadeReveal delay={200}>
                  <div className="border-l-2 border-zinc-800 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-zinc-600 rounded-full -left-[5px] top-2"></div>
                    <span className="font-mono text-xs text-zinc-500 uppercase">2024 - 2025 // Core Certifications</span>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#ccff00] shrink-0" /> Oracle Cloud AI Foundations Associate</li>
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#ccff00] shrink-0" /> Cisco CCNA: Intro to Networks</li>
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#ccff00] shrink-0" /> NPTEL: Industry 4.0, IIoT, Python</li>
                    </ul>
                  </div>
                </FadeReveal>
              </div>
            </div>

            {/* Honors & Publications */}
            <div>
              <FadeReveal>
                <h2 className="font-mono text-[#ccff00] text-[10px] md:text-xs uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">
                  Honors & Publications
                </h2>
              </FadeReveal>
              
              <div className="space-y-6">
                {[
                  { title: "1st Prize - Dev Arena", desc: "24-Hour Hackathon (AI Shop Floor System)" },
                  { title: "1st Prize - TWYSTRA", desc: "National Symposium" },
                  { title: "1st Prize - Big Prototype", desc: "Contest (Li-Fi System Integration)" },
                  { title: "2nd Prize - Innovation Challenge", desc: "Technical Problem Solving" },
                  { title: "Publication: NCSPCN-2025", desc: "Infrared-Based Music Transmitter/Receiver (SVCE)" }
                ].map((honor, idx) => (
                  <FadeReveal delay={idx * 100} key={idx}>
                    <div className="bg-[#0a0a0c] border border-zinc-800 p-4 flex items-center gap-4 hover:border-[#ccff00] transition-colors">
                      <Award className="w-6 h-6 text-[#ccff00] shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold uppercase text-white">{honor.title}</h4>
                        <p className="text-xs text-zinc-500 uppercase font-mono mt-1">{honor.desc}</p>
                      </div>
                    </div>
                  </FadeReveal>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* INTERACTIVE PROJECTS GRID */}
        <section className="py-24 md:py-32 bg-[#050505]">
          <FadeReveal className="px-4 md:px-8">
            <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between md:items-end gap-6">
              <div>
                <div className="font-mono text-[#ccff00] text-[10px] md:text-xs uppercase tracking-widest mb-4">
                  [ System Logs & Builds ]
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                  Deployed Architectures
                </h2>
              </div>
              <a href="https://github.com/Yogarathinam" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-zinc-700 text-white px-5 py-2 text-sm font-bold uppercase tracking-widest hover:border-[#ccff00] hover:text-[#ccff00] transition-colors cursor-none interactive-element w-max">
                <GithubIcon className="w-4 h-4" /> View All on GitHub
              </a>
            </div>
          </FadeReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-zinc-900 border-y border-zinc-900">
            {projects.map((project, index) => (
              <HoverProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* BRUTALIST FOOTER WITH CTAS */}
        <section id="contact" className="py-24 md:py-32 px-4 md:px-8 bg-[#ccff00] text-black overflow-hidden relative interactive-element">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 hidden md:block">
            <CircuitBoard className="w-[40rem] h-[40rem]" />
          </div>

          <FadeReveal className="relative z-10 max-w-6xl mx-auto flex flex-col items-start md:items-center md:text-center">
            <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest border-2 border-black px-4 py-2 mb-8 md:mb-12">
              [ Open For Opportunities & Custom Builds ]
            </div>
            
            <a href="mailto:yogarathinam26@gmail.com" className="group relative block w-full cursor-none">
              <h2 className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none group-hover:tracking-widest transition-all duration-700 text-left md:text-center">
                GET IN TOUCH
              </h2>
            </a>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full justify-center">
               <a href="/resume.pdf" target="_blank" className="flex items-center justify-center gap-2 border-2 border-black bg-black text-[#ccff00] px-8 py-4 text-sm md:text-base font-bold uppercase tracking-widest hover:bg-transparent hover:text-black transition-colors cursor-none interactive-element">
                  <FileText className="w-5 h-5" /> Download Resume
               </a>
               <a href="https://linkedin.com/in/yogarathinam" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border-2 border-black text-black px-8 py-4 text-sm md:text-base font-bold uppercase tracking-widest hover:bg-black hover:text-[#ccff00] transition-colors cursor-none interactive-element">
                  <ArrowRight className="w-5 h-5" /> Connect on LinkedIn
               </a>
            </div>
            
            <p className="mt-8 font-bold text-black/70 max-w-md mx-auto text-sm md:text-base text-center">
              Constantly learning, constantly building. Let's engineer something real.
            </p>
          </FadeReveal>
        </section>
        
        <footer className="py-8 px-4 md:px-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-mono text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest bg-[#050505]">
          <div>© {new Date().getFullYear()} YOGARATHINAM.TL <br className="md:hidden" /> // FULL-STACK SYSTEMS INTEGRATOR</div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <a href="https://github.com/Yogarathinam" target="_blank" rel="noreferrer" className="hover:text-[#ccff00] transition-colors cursor-none interactive-element">GitHub_Repository</a>
            <a href="https://linkedin.com/in/yogarathinam" target="_blank" rel="noreferrer" className="hover:text-[#ccff00] transition-colors cursor-none interactive-element">LinkedIn_Network</a>
            <a href="#" className="hover:text-[#ccff00] transition-colors cursor-none interactive-element">SkillRack_Profile</a>
          </div>
        </footer>

      </main>

      {/* Global CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700;900&display=swap');

        html { 
          scroll-behavior: smooth; 
          background: #050505;
        }

        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }

        /* GLOBALLY HIDE DEFAULT CURSOR ON DESKTOP */
        @media (min-width: 768px) {
          .custom-cursor-wrapper, 
          .custom-cursor-wrapper * {
            cursor: none !important;
          }
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        /* Modern Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          background: #050505;
          border-left: 1px solid #18181b;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #ccff00;
        }
      `}} />
    </div>
  );
}