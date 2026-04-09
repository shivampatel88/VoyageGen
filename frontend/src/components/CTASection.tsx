import React from 'react';

const CTASection: React.FC = () => {
    return (
        <section className="relative py-40 bg-black overflow-hidden perspective-container flex items-center justify-center">
            {/* Massive background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[800px] md:h-[800px] bg-gradient-to-r from-emerald-500/30 to-blue-600/30 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 noise-bg opacity-30" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none drop-shadow-2xl">
                    Stop Booking.<br />
                    <span className="shimmer-text bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white">Start Creating.</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-white/70 font-light mb-12 max-w-2xl mx-auto">
                    Join thousands of forward-thinking travel advisors using VoyageGen to close more deals, faster.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
                    <div className="relative w-full sm:w-auto flex-1">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <input 
                            type="email" 
                            placeholder="Enter your work email" 
                            className="relative w-full bg-white/5 border border-white/20 text-white rounded-full px-8 py-5 outline-none focus:border-emerald-400/50 transition-colors backdrop-blur-md"
                        />
                    </div>
                    <button className="relative group w-full sm:w-auto px-8 py-5 bg-white text-black font-bold rounded-full text-lg overflow-hidden shrink-0">
                        <span className="relative z-10">Get Early Access</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
                <p className="text-white/40 text-sm mt-6">
                    No credit card required. 14-day free trial.
                </p>
            </div>
            
            {/* Grid overlay for depth */}
            <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none opacity-50" style={{ transform: 'perspective(1000px) rotateX(60deg) scale(2)', transformOrigin: 'bottom' }}></div>
        </section>
    );
};

export default CTASection;
