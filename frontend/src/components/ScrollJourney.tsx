import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollJourney: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    // Portal references
    const layer1 = useRef<HTMLDivElement>(null);
    const layer2 = useRef<HTMLDivElement>(null);
    const layer3 = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    
    // Vehicle reference
    const jetRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=400%", // 400vh scroll space
                pin: true,
                scrub: 1.5,
            }
        });

        // Constant vibration/shake for the jet while scrolling
        gsap.to(jetRef.current, {
            y: "+=15",
            x: "+=5",
            rotation: "+=2",
            yoyo: true,
            repeat: -1,
            duration: 0.8,
            ease: "sine.inOut"
        });

        // The "Apple Fly-Through" 3D Tunnel Effect
        tl.to(layer1.current, { scale: 12, opacity: 0, ease: "power2.in", duration: 1 }, 0)
          
          .fromTo(layer2.current, { scale: 0.1, opacity: 0 }, { scale: 1, opacity: 1, ease: "power1.inOut", duration: 0.8 }, 0.2)
          .to(layer2.current, { scale: 12, opacity: 0, ease: "power2.in", duration: 1 }, 1)
          
          .fromTo(layer3.current, { scale: 0.1, opacity: 0 }, { scale: 1, opacity: 1, ease: "power1.inOut", duration: 0.8 }, 1.2)
          
          .fromTo(textRef.current, { scale: 0.8, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.5 }, 1.5)
          
          // Jet Animation: Start cruising, then scale down and fly into the final portal
          .to(jetRef.current, { 
              scale: 0.1, 
              y: -500, // Fly up and away
              opacity: 0, 
              ease: "power3.in",
              duration: 0.5 
          }, 1.5);

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative h-screen w-full bg-black overflow-hidden perspective-container">
            {/* Dark background base */}
            <div className="absolute inset-0 bg-black z-0"></div>

            <div ref={wrapperRef} className="absolute inset-0 z-10 flex items-center justify-center transform-style-preserve-3d overflow-hidden">
                
                {/* --- The Fixed Aircraft (Centered, shaking, flying through layers) --- */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                    <svg ref={jetRef} width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                        {/* Premium Jet SVG Path */}
                        <path d="M22 16V14L13 8V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V8L1 14V16L10 13V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13L22 16Z" fill="url(#jetGradient)" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5"/>
                        <defs>
                            <linearGradient id="jetGradient" x1="1" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#ffffff" />
                                <stop offset="0.5" stopColor="#a7f3d0" />
                                <stop offset="1" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Glowing Engine trail */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[2px] h-32 bg-gradient-to-b from-emerald-400 via-emerald-400/50 to-transparent blur-[2px] animate-pulse"></div>
                </div>

                {/* --- Layer 1: The First Portal (Lush Jungle / Resort) --- */}
                <div ref={layer1} className="absolute inset-0 flex items-center justify-center w-full h-full will-change-transform z-40">
                    <div className="relative w-[85vw] h-[65vh] md:w-[70vw] md:h-[60vh] rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(16,185,129,0.2)] border border-white/10">
                        <img 
                            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2000&auto=format&fit=crop" 
                            alt="Jungle Resort" 
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 flex flex-col justify-between p-[10%] backdrop-blur-[2px]">
                            <h2 className="text-4xl md:text-8xl font-black text-white drop-shadow-2xl">
                                From <br/><span className="text-emerald-400">Inspiration.</span>
                            </h2>
                            <p className="text-white/60 font-mono tracking-widest uppercase text-sm">Altitude: 35,000 ft</p>
                        </div>
                    </div>
                </div>

                {/* --- Layer 2: The Second Portal (Deep Ocean / Maldives) --- */}
                <div ref={layer2} className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 will-change-transform z-30">
                    <div className="relative w-[85vw] h-[65vh] md:w-[70vw] md:h-[60vh] rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.3)] border border-white/10">
                        <img 
                            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000&auto=format&fit=crop" 
                            alt="Maldives Water" 
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 flex flex-col justify-between p-[10%] backdrop-blur-[2px]">
                            <h2 className="text-4xl md:text-8xl font-black text-white drop-shadow-2xl">
                                Through <br/><span className="text-blue-400">Intelligence.</span>
                            </h2>
                            <p className="text-white/60 font-mono tracking-widest uppercase text-sm">Mach: 0.85</p>
                        </div>
                    </div>
                </div>

                {/* --- Layer 3: The Final Arrival (Golden Italian Coast) --- */}
                <div ref={layer3} className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 will-change-transform z-20">
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src="https://images.unsplash.com/photo-1516483638261-f40889d28e67?q=80&w=2500&auto=format&fit=crop" 
                            alt="Amalfi Coast" 
                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                    </div>
                    
                    <div ref={textRef} className="relative z-50 flex flex-col items-center justify-center text-center px-6 mt-32">
                        <div className="inline-block px-6 py-2 bg-emerald-500/10 backdrop-blur-md rounded-full border border-emerald-500/20 text-emerald-400 font-mono text-sm tracking-[0.4em] mb-6 shadow-2xl animate-pulse">
                            DESTINATION ARRIVAL
                        </div>
                        <h2 className="text-5xl md:text-9xl font-black text-white leading-tight drop-shadow-2xl">
                            To <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Reality.</span>
                        </h2>
                        <p className="mt-8 text-xl md:text-3xl text-white/80 font-light max-w-3xl drop-shadow-md">
                            VoyageGen completely automates the pipeline from a simple client request to a booked, high-margin itinerary.
                        </p>
                    </div>
                </div>

            </div>
            
            <style>{`
                .transform-style-preserve-3d {
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }
            `}</style>
        </section>
    );
};

export default ScrollJourney;
