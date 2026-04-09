import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const useInView = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, inView };
};

const NumberCounter: React.FC<{ n: number, inView: boolean }> = ({ n, inView }) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: inView ? n : 0,
        delay: 100,
        config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.span>{number.to(n => n.toFixed(0))}</animated.span>;
};

const Statistics: React.FC = () => {
    const { ref, inView } = useInView();

    const stats = [
        { label: 'Global Luxury Partners', value: 40, suffix: '+' },
        { label: 'Active Destinations', value: 190, suffix: '+' },
        { label: 'AI Generated Quotes', value: 50000, suffix: '+' },
        { label: 'Time Saved (Hours)', value: 8500, suffix: '+' }
    ];

    return (
        <section className="py-32 relative bg-black overflow-hidden border-y border-white/5" ref={ref}>
            <div className="absolute inset-0 noise-bg" />
            
            {/* Subtle radial gradients behind the numbers */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Built for scale. Designed for speed.</h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        VoyageGen is powering the next generation of boutique travel agencies with unparalleled efficiency.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white mb-4 transform hover:scale-110 transition-transform duration-500 cursor-default">
                                <NumberCounter n={stat.value} inView={inView} />{stat.suffix}
                            </div>
                            <div className="text-sm tracking-widest text-white/50 uppercase font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
