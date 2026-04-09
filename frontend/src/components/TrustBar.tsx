import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { FaBuilding, FaGlobe, FaStar, FaUsers } from 'react-icons/fa';

// Custom hook for intersection observer to trigger animations
const useInView = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect(); // Only animate once
            }
        }, { threshold: 0.5 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, inView };
};

const NumberCounter: React.FC<{ n: number, inView: boolean }> = ({ n, inView }) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: inView ? n : 0,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.span>{number.to(n => n.toFixed(0))}</animated.span>;
};

const FloatNumberCounter: React.FC<{ n: number, inView: boolean }> = ({ n, inView }) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: inView ? n : 0,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.span>{number.to(n => n.toFixed(1))}</animated.span>;
};

const TrustBar: React.FC = () => {
    const { ref, inView } = useInView();

    return (
        <section ref={ref} className="relative z-20 -mt-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-8 md:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-white/20">
                
                <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                        <FaBuilding className="text-xl text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white tracking-tight">
                            <NumberCounter n={40} inView={inView} />+
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-widest">Premium Partners</div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                        <FaGlobe className="text-xl text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white tracking-tight">
                            <NumberCounter n={190} inView={inView} />+
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-widest">Countries</div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                        <FaUsers className="text-xl text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white tracking-tight">
                            <NumberCounter n={10000} inView={inView} />+
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-widest">Itineraries</div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                        <FaStar className="text-xl text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white tracking-tight flex items-baseline">
                            <FloatNumberCounter n={4.9} inView={inView} /><span className="text-lg text-emerald-400 ml-1">★</span>
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-widest">User Rating</div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default TrustBar;
