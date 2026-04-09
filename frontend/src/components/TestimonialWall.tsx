import React from 'react';
import { FaStar } from 'react-icons/fa';

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Luxury Travel Advisor",
        text: "VoyageGen cut my itinerary planning time from 4 hours down to 45 seconds. My clients think I haven't slept in weeks. It's magic.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    },
    {
        name: "Marcus Thorne",
        role: "Founder, Thorne Escapes",
        text: "The semantic matching is insane. I typed 'honeymoon in Greece, loves wine but hates crowds' and it found a secluded villa in Paros instantly.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
        name: "Elena Rodriguez",
        role: "Independent Agent",
        text: "The 1-click PDF export has won me three high-ticket clients this month alone. It looks like an editorial magazine spread.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
    },
    {
        name: "David Chen",
        role: "Boutique Agency Owner",
        text: "I was skeptical about AI in travel, but VoyageGen doesn't replace us—it upgrades us to super-agents. Essential tool.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
        name: "Samantha Lee",
        role: "Travel Consultant",
        text: "The ability to instantly compare quotes for standard vs luxury options is a game changer. The dynamic markups save me hours.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    }
];

const TestimonialsWall: React.FC = () => {
    // Duplicate array to create seamless loop
    const marqueeItems = [...testimonials, ...testimonials];

    return (
        <section className="py-32 bg-black overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />

            <div className="text-center mb-16 relative z-10 px-6">
                <span className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4 block">Wall of Love</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                    Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Elite Agents.</span>
                </h2>
            </div>

            <div className="relative flex overflow-x-hidden w-full group mask-image-gradient">
                <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
                    {marqueeItems.map((item, idx) => (
                        <div key={idx} className="w-[400px] shrink-0 mx-4 glass-panel p-8 rounded-2xl glow-border">
                            <div className="flex gap-1 text-emerald-400 mb-6">
                                {[...Array(item.rating)].map((_, i) => <FaStar key={i} />)}
                            </div>
                            <p className="text-white/80 text-lg leading-relaxed mb-8 whitespace-normal font-light">
                                "{item.text}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full border border-white/20 object-cover" />
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide">{item.name}</h4>
                                    <p className="text-white/40 text-xs">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                    width: max-content;
                }
            `}</style>
        </section>
    );
};

export default TestimonialsWall;
