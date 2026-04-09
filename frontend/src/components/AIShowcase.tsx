import React, { useEffect, useRef, useState } from 'react';

const AIShowcase: React.FC = () => {
    const textToType = "Find me a romantic overwater villa with a private pool in Maldives for a honeymoon trip.";
    const [typedText, setTypedText] = useState("");
    const [typingDone, setTypingDone] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                let currentIdx = 0;
                setTypedText("");
                setTypingDone(false);
                
                const interval = setInterval(() => {
                    currentIdx++;
                    setTypedText(textToType.substring(0, currentIdx));
                    if (currentIdx >= textToType.length) {
                        clearInterval(interval);
                        setTimeout(() => setTypingDone(true), 500);
                    }
                }, 40);
                
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={containerRef} className="py-32 relative bg-black overflow-hidden border-t border-white/10">
            <div className="absolute inset-0 noise-bg" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Side: The "Terminal" */}
                    <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(16,185,129,0.1)] border-white/20">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex gap-2 items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <div className="ml-4 text-xs font-mono text-white/40">semantic_agent.ts</div>
                        </div>
                        <div className="p-6 font-mono text-sm leading-relaxed min-h-[400px] flex flex-col">
                            <div className="text-white/60 mb-2">
                                <span className="text-emerald-400">voyagegen</span>@engine:~$ initialize_query
                            </div>
                            <div className="text-emerald-300 bg-emerald-900/20 py-1 px-2 rounded-md mb-6 border border-emerald-500/20">
                                Model: Gemini Pro | Vectors: Active | WebSearch: Disabled
                            </div>
                            <div className="mb-4">
                                <span className="text-white">Query input: </span>
                                <span className="text-white font-bold">"{typedText}"<span className="animate-pulse">_</span></span>
                            </div>

                            {typingDone && (
                                <div className="mt-8 animate-[fadeIn_0.5s_ease-out_forwards]">
                                    <div className="text-white/40 mb-2">Processing embeddings...</div>
                                    <div className="text-emerald-400 mb-4">[OK] Vector match found (score: 0.982)</div>
                                    
                                    <div className="space-y-3">
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center opacity-0 animate-[slideUp_0.5s_ease-out_forwards_0.2s]">
                                            <span className="text-white font-semibold">Soneva Jani, Maldives</span>
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-md">98% Match</span>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center opacity-0 animate-[slideUp_0.5s_ease-out_forwards_0.4s]">
                                            <span className="text-white font-semibold">Gili Lankanfushi</span>
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-md">92% Match</span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-blue-400 mt-6 animate-[fadeIn_0.5s_ease-out_forwards_0.8s]">
                                        {'> Generation complete. Formatting itinerary...'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: The Value Prop */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Semantic Intelligence</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            We don't do keywords. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">We understand intent.</span>
                        </h2>
                        <p className="text-lg text-white/60 mb-8 leading-relaxed">
                            Stop forcing your clients' dreams into rigid drop-down menus. VoyageGen uses <strong>Gemini embeddings</strong> and <strong>vector search</strong> to understand the exact nuance of natural language queries, matching them against thousands of partner offerings instantly.
                        </p>
                        
                        <ul className="space-y-4 mb-10">
                            {[
                                "Understands mood, pace, and vibe (e.g., 'adventurous but relaxing')",
                                "Ranks results by mathematical similarity score",
                                "Groq LLM automatically writes the day-by-day itinerary"
                            ].map((feature, i) => (
                                <li key={i} className="flex gap-3 text-white/80">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default AIShowcase;
