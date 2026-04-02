import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { 
    FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaMoneyBillWave, 
    FaStar, FaEye, FaShare, FaDownload, FaExternalLinkAlt
} from 'react-icons/fa';

const TravelerQuotes: React.FC = () => {
    const { user } = useAuth();
    const token = user?.token || '';
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/quotes/user`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuotes(data);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            case 'SENT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'VIEWED': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'ACCEPTED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'DECLINED': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-400 mx-auto mb-4" />
                    <div className="text-white text-xl font-medium">Loading your quotes...</div>
                    <div className="text-gray-400 text-sm mt-2">Fetching your travel quotations</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                        My Travel Quotes
                    </h1>
                    <p className="text-gray-400 text-lg">View and manage your travel quotations</p>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Link
                        to="/traveler/plan-journey"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                    >
                        Plan New Journey
                    </Link>
                </motion.div>

                {/* Quotes List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {quotes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-12 text-center"
                        >
                            <FaMoneyBillWave className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">No quotes yet</h3>
                            <p className="text-gray-500 mb-6">Your travel quotes will appear here once agents create them</p>
                            <Link
                                to="/traveler/plan-journey"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                            >
                                Plan Your First Journey
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid gap-6">
                            {quotes.map((quote, index) => (
                                <motion.div
                                    key={quote._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                                        <FaMapMarkerAlt className="text-blue-400 text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white">
                                                            {quote.requirementId?.destination || 'Unknown Destination'}
                                                        </h3>
                                                        <p className="text-gray-400">{quote.requirementId?.tripType || 'Trip Type'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaUsers className="text-blue-400 text-sm" />
                                                        <span className="text-sm text-gray-300">
                                                            {quote.requirementId?.pax?.adults || 0} Adults
                                                            {quote.requirementId?.pax?.children > 0 && `, ${quote.requirementId?.pax?.children} Children`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaCalendarAlt className="text-blue-400 text-sm" />
                                                        <span className="text-sm text-gray-300">{quote.requirementId?.duration || 0} Days</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaMoneyBillWave className="text-blue-400 text-sm" />
                                                        <span className="text-sm text-gray-300">
                                                            ₹{quote.finalPrice?.toLocaleString() || quote.netCost?.toLocaleString() || 'Not specified'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-lg">
                                                        <FaEye className="text-blue-400 text-sm" />
                                                        <span className="text-sm text-gray-300">{quote.views || 0} Views</span>
                                                    </div>
                                                </div>

                                                {/* Quote Details */}
                                                <div className="bg-zinc-800/30 rounded-xl p-4 mb-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Quote ID:</span>
                                                            <span className="text-gray-300 ml-2 font-mono">#{quote._id.slice(-6)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Created:</span>
                                                            <span className="text-gray-300 ml-2">
                                                                {new Date(quote.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Partner:</span>
                                                            <span className="text-gray-300 ml-2">
                                                                {quote.partnerId?.name || 'Travel Partner'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end gap-3 ml-6">
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusTheme(quote.status)}`}>
                                                    {quote.status.replace(/_/g, ' ')}
                                                </span>
                                                
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/quote/view/${quote.publicToken}`}
                                                        target="_blank"
                                                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <FaExternalLinkAlt size={14} />
                                                        View Quote
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="border-t border-zinc-800/50 pt-4">
                                            <div className="flex flex-wrap gap-3">
                                                <button className="px-4 py-2 bg-zinc-800 text-gray-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2">
                                                    <FaShare size={14} />
                                                    Share
                                                </button>
                                                <button className="px-4 py-2 bg-zinc-800 text-gray-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2">
                                                    <FaDownload size={14} />
                                                    Download PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TravelerQuotes;
