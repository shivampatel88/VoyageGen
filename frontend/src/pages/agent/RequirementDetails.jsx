import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaFilter, FaHotel, FaCar, FaUmbrellaBeach, FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaStar, FaEye, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RequirementDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [requirement, setRequirement] = useState(null);
    const [partners, setPartners] = useState([]);
    const [selectedPartners, setSelectedPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [viewingPartner, setViewingPartner] = useState(null);

    // Filter State
    const [filters, setFilters] = useState({
        destination: '',
        budget: '',
        startDate: '',
        duration: '',
        adults: 1,
        hotelStar: 4,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token} ` } };

                // Fetch Requirement
                const reqRes = await axios.get(`http://localhost:5000/api/requirements/${id}`, config);
                setRequirement(reqRes.data);

                // Auto-fill filters
                setFilters({
                    destination: reqRes.data.destination,
                    budget: reqRes.data.budget,
                    startDate: reqRes.data.startDate ? reqRes.data.startDate.split('T')[0] : '',
                    duration: reqRes.data.duration,
                    adults: reqRes.data.pax.adults,
                    hotelStar: reqRes.data.hotelStar,
                });

                // Initial Partner Fetch
                fetchPartners({
                    destination: reqRes.data.destination,
                    tripType: reqRes.data.tripType,
                    budget: reqRes.data.budget,
                    startDate: reqRes.data.startDate,
                    duration: reqRes.data.duration,
                    adults: reqRes.data.pax.adults,
                    hotelStar: reqRes.data.hotelStar,
                }, config);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user]);

    const fetchPartners = async (filterParams, config) => {
        try {
            const res = await axios.post('http://localhost:5000/api/partners/filter', filterParams, config);
            setPartners(res.data);
        } catch (error) {
            console.error('Error filtering partners:', error);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        fetchPartners(filters, config);
    };

    const togglePartner = (partnerId) => {
        setSelectedPartners(prev =>
            prev.includes(partnerId)
                ? prev.filter(id => id !== partnerId)
                : [...prev, partnerId].slice(0, 3) // Max 3
        );
    };

    const handleGenerateQuotes = async () => {
        if (selectedPartners.length === 0) return;
        setGenerating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/quotes/generate', {
                requirementId: id,
                partnerIds: selectedPartners,
            }, config);

            navigate('/agent/quotes'); // Redirect to quotes list (to be built)
        } catch (error) {
            console.error('Error generating quotes:', error);
            alert('Failed to generate quotes');
        } finally {
            setGenerating(false);
        }
    };

    if (loading || !requirement) return <div className="p-8 text-center"><FaSpinner className="animate-spin text-4xl mx-auto text-emerald-400" /></div>;

    return (
        <div className="max-w-7xl mx-auto relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Requirement Details</h1>
                    <p className="text-gray-400">ID: {requirement._id}</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Status</p>
                        <span className="text-emerald-400 font-bold">{requirement.status}</span>
                    </div>
                </div>
            </div>

            {/* Requirement Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-bold mb-4 text-emerald-400">Traveler Info</h3>
                    <p><span className="text-gray-400">Name:</span> {requirement.contactInfo.name}</p>
                    <p><span className="text-gray-400">Email:</span> {requirement.contactInfo.email}</p>
                    <p><span className="text-gray-400">Phone:</span> {requirement.contactInfo.phone}</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-bold mb-4 text-emerald-400">Trip Details</h3>
                    <p><span className="text-gray-400">Destination:</span> {requirement.destination}</p>
                    <p><span className="text-gray-400">Type:</span> {requirement.tripType}</p>
                    <p><span className="text-gray-400">Duration:</span> {requirement.duration} Days</p>
                    <p><span className="text-gray-400">Pax:</span> {requirement.pax.adults} Ad, {requirement.pax.children} Ch</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-bold mb-4 text-emerald-400">Preferences</h3>
                    <p><span className="text-gray-400">Budget:</span> ₹{requirement.budget.toLocaleString()}</p>
                    <p><span className="text-gray-400">Hotel:</span> {requirement.hotelStar} Star</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {requirement.preferences.map((pref, i) => (
                            <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">{pref}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Partner Filter & Selection */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif">Match Partners</h2>
                    <button
                        onClick={handleGenerateQuotes}
                        disabled={selectedPartners.length === 0 || generating}
                        className="bg-emerald-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                    >
                        {generating ? 'Generating...' : `Generate Quotes (${selectedPartners.length})`}
                    </button>
                </div>

                {/* Filter Bar */}
                <form onSubmit={handleFilter} className="flex flex-wrap gap-4 mb-8 bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="w-full md:w-auto flex-1 min-w-[150px]">
                        <label className="block text-xs text-gray-500 mb-1">Destination</label>
                        <input
                            type="text"
                            value={filters.destination}
                            onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 focus:border-emerald-500 outline-none text-white py-1 transition-colors"
                        />
                    </div>
                    <div className="w-full md:w-auto flex-1 min-w-[150px]">
                        <label className="block text-xs text-gray-500 mb-1">Budget</label>
                        <input
                            type="number"
                            value={filters.budget}
                            onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 focus:border-emerald-500 outline-none text-white py-1 transition-colors"
                        />
                    </div>
                    <div className="w-full md:w-auto flex-1 min-w-[150px]">
                        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 focus:border-emerald-500 outline-none text-white py-1 transition-colors"
                        />
                    </div>
                    <div className="w-full md:w-auto flex-1 min-w-[100px]">
                        <label className="block text-xs text-gray-500 mb-1">Duration</label>
                        <input
                            type="number"
                            value={filters.duration}
                            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 focus:border-emerald-500 outline-none text-white py-1 transition-colors"
                        />
                    </div>
                    <div className="w-full md:w-auto flex-1 min-w-[80px]">
                        <label className="block text-xs text-gray-500 mb-1">Adults</label>
                        <input
                            type="number"
                            value={filters.adults}
                            onChange={(e) => setFilters({ ...filters, adults: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 focus:border-emerald-500 outline-none text-white py-1 transition-colors"
                        />
                    </div>
                    <div className="w-full md:w-auto flex-1 min-w-[200px]">
                        <label className="block text-xs text-gray-500 mb-1">Hotel Rating</label>
                        <div className="flex gap-2">
                            {[3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFilters({ ...filters, hotelStar: star })}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition-all ${filters.hotelStar === star
                                        ? 'bg-emerald-500 border-emerald-500 text-black'
                                        : 'bg-white/5 border-white/20 text-white hover:border-emerald-500/50'
                                        }`}
                                >
                                    {[...Array(star)].map((_, i) => (
                                        <FaStar key={i} className="text-xs" />
                                    ))}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-6 rounded-lg flex items-center gap-2 mt-4 md:mt-0 transition-colors">
                        <FaFilter /> Filter
                    </button>
                </form>

                {/* Partners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map(partner => (
                        <div
                            key={partner._id}
                            className={`bg-zinc-900 border rounded-xl overflow-hidden transition-all group relative ${selectedPartners.includes(partner.userId)
                                ? 'border-emerald-500 ring-1 ring-emerald-500'
                                : 'border-white/10 hover:border-white/30'
                                }`}
                        >
                            {/* Image */}
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={partner.images && partner.images.length > 0 ? partner.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                                    alt={partner.companyName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-emerald-400 flex items-center gap-1">
                                    <FaStar /> {partner.rating}
                                </div>
                                {selectedPartners.includes(partner.userId) && (
                                    <div className="absolute top-2 left-2 bg-emerald-500 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                        <FaCheckCircle /> Selected
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-xl font-serif font-bold mb-1 text-white">{partner.companyName}</h3>
                                <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-emerald-500" /> {partner.destinations.join(', ')}
                                </p>

                                <p className="text-sm text-gray-300 line-clamp-2 mb-4 h-10">{partner.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4 h-16 overflow-hidden">
                                    {partner.amenities && partner.amenities.slice(0, 4).map((am, i) => (
                                        <span key={i} className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5">{am}</span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-gray-500">Starting from</p>
                                        <p className="text-lg font-bold text-emerald-400">₹{partner.startingPrice ? partner.startingPrice.toLocaleString() : 'N/A'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewingPartner(partner)}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => togglePartner(partner.userId)}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedPartners.includes(partner.userId)
                                                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                                                : 'bg-white text-black hover:bg-gray-200'
                                                }`}
                                        >
                                            {selectedPartners.includes(partner.userId) ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {partners.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                            No partners found matching these criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Partner Details Modal */}
            <AnimatePresence>
                {viewingPartner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setViewingPartner(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-zinc-800"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="relative h-64 md:h-80">
                                <img
                                    src={viewingPartner.images && viewingPartner.images.length > 0 ? viewingPartner.images[0] : 'https://placehold.co/800x400'}
                                    alt={viewingPartner.companyName}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setViewingPartner(null)}
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                                >
                                    <FaTimes />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">{viewingPartner.companyName}</h2>
                                    <p className="text-emerald-400 flex items-center gap-2 mt-1">
                                        <FaMapMarkerAlt /> {viewingPartner.destinations.join(', ')}
                                        <span className="text-white/50">•</span>
                                        <FaStar /> {viewingPartner.rating}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-white">About</h3>
                                        <p className="text-gray-300 leading-relaxed">{viewingPartner.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-white">Amenities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingPartner.amenities && viewingPartner.amenities.map((am, i) => (
                                                <span key={i} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">
                                                    {am}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-white">Nearby Sightseeing</h3>
                                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                                            {viewingPartner.sightSeeing && viewingPartner.sightSeeing.map((sight, i) => (
                                                <li key={i}>{sight}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-black/30 p-6 rounded-xl border border-white/10">
                                        <p className="text-sm text-gray-500 mb-1">Starting Price</p>
                                        <p className="text-3xl font-bold text-emerald-400 mb-4">₹{viewingPartner.startingPrice ? viewingPartner.startingPrice.toLocaleString() : 'N/A'}</p>

                                        <button
                                            onClick={() => {
                                                togglePartner(viewingPartner.userId);
                                                setViewingPartner(null);
                                            }}
                                            className={`w-full py-3 rounded-xl font-bold transition-all ${selectedPartners.includes(viewingPartner.userId)
                                                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                                                : 'bg-white text-black hover:bg-gray-200'
                                                }`}
                                        >
                                            {selectedPartners.includes(viewingPartner.userId) ? 'Selected' : 'Select Partner'}
                                        </button>
                                    </div>

                                    <div className="bg-black/30 p-6 rounded-xl border border-white/10">
                                        <h4 className="font-bold mb-4 text-white">Specializations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingPartner.specializations && viewingPartner.specializations.map((spec, i) => (
                                                <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RequirementDetails;
