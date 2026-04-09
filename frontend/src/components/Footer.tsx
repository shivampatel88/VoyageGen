import React from 'react';
import { FaPlaneDeparture, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-12 border-t border-white/10 relative overflow-hidden">
            {/* Subtle bottom glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-10 bg-emerald-500/20 blur-[50px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="flex items-center gap-2 text-3xl font-black tracking-tighter mb-6 md:mb-0">
                        <FaPlaneDeparture className="text-emerald-400" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">VoyageGen</span>
                    </div>

                    <div className="flex gap-8">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all"><FaTwitter size={18} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all"><FaInstagram size={18} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all"><FaLinkedin size={18} /></a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/40 border-t border-white/10 pt-8 mt-8">
                    <p>&copy; {new Date().getFullYear()} VoyageGen AI. All rights reserved.</p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
