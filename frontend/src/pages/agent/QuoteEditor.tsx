import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    FaSave, FaArrowLeft, FaCalculator, FaPlane, FaHotel, FaTicketAlt, 
    FaUser, FaMapMarkerAlt, FaCalendarAlt, FaSpinner, FaEnvelope, FaMap, FaFilePdf 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ItineraryTimeline from '../../components/ItineraryTimeline';
import { ItineraryDay } from '../../types';

const QuoteEditor: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState(false);
    const [generatingItinerary, setGeneratingItinerary] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    
    // Feature State
    const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
    const [itineraryError, setItineraryError] = useState<string | null>(null);
    const printableRef = useRef<HTMLDivElement>(null);

    // Cost state
    const [costs, setCosts] = useState({
        net: 0,
        margin: 15,
        final: 0,
        perHead: 0
    });

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/quotes/${id}`, config);
                setQuote(res.data);

                // Load pre-existing itinerary if available
                if (res.data.itinerary && res.data.itinerary.length > 0) {
                    setItinerary(res.data.itinerary);
                }

                if (res.data.costs) {
                    setCosts(res.data.costs);
                } else {
                    let netCost = 0;
                    res.data.sections?.hotels?.forEach((h: any) => netCost += (h.total || 0));
                    res.data.sections?.transport?.forEach((t: any) => netCost += (t.total || 0));
                    res.data.sections?.activities?.forEach((a: any) => netCost += (a.total || 0));
                    setCosts(prev => ({ ...prev, net: netCost }));
                }
            } catch (error) {
                console.error('Error fetching quote:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user && id) {
            fetchQuote();
        }
    }, [user, id]);

    // Recalculate final cost when net cost or margin changes
    useEffect(() => {
        if (!quote) return;
        const marginAmount = costs.net * (costs.margin / 100);
        const finalCost = costs.net + marginAmount;
        const pax = (quote.requirementId?.pax?.adults || 0) + (quote.requirementId?.pax?.children || 0) || 1;
        setCosts(prev => ({
            ...prev,
            final: Math.round(finalCost),
            perHead: Math.round(finalCost / pax)
        }));
    }, [costs.net, costs.margin, quote]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/quotes/${id}`, {
                costs,
            }, config);
            alert('Quote updated successfully!');
        } catch (error) {
            console.error('Error updating quote:', error);
            alert('Failed to update quote');
        } finally {
            setSaving(false);
        }
    };

    const handleSend = async () => {
        setSending(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/quotes/${id}/send`, {}, config);
            alert('Quote sent to traveler via email!');
            navigate('/agent/quotes');
        } catch (error) {
            console.error('Error sending quote:', error);
            alert('Failed to send quote.');
        } finally {
            setSending(false);
        }
    };   
        
    const handleGenerateItinerary = async () => {
        setGeneratingItinerary(true);
        setItineraryError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/quotes/${id}/itinerary`,
                {},
                config
            );
            setItinerary(res.data.itinerary);
        } catch (err) {
            setItineraryError('Failed to generate itinerary. Please try again.');
        } finally {
            setGeneratingItinerary(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!printableRef.current) return;
        setDownloadingPdf(true);
        try {
            const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                import('jspdf'),
                import('html2canvas'),
            ]);

            const canvas = await html2canvas(printableRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0a0a0a',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let yPos = 0;
            let remaining = imgHeight;

            while (remaining > 0) {
                pdf.addImage(imgData, 'JPEG', 0, -yPos, imgWidth, imgHeight);
                remaining -= pageHeight;
                yPos += pageHeight;
                if (remaining > 0) pdf.addPage();
            }

            const destination = quote?.requirementId?.destination || 'Trip';
            pdf.save(`VoyageGen-Quote-${destination.replace(/\s+/g, '-')}.pdf`);
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingPdf(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-emerald-400" />
        </div>
    );

    if (!quote) return <div>Quote not found</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-white">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div ref={printableRef} className="p-4 md:p-8 rounded-3xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <button
                                onClick={() => navigate('/agent/quotes')}
                                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors no-print"
                            >
                                <FaArrowLeft /> Back to Quotes
                            </button>
                            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                                Edit Quote
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="bg-zinc-800 px-3 py-1 rounded-full border border-white/10">#{quote._id.slice(-6)}</span>
                                <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-emerald-400" /> {quote.requirementId?.destination}</span>
                                <span className="flex items-center gap-2"><FaCalendarAlt className="text-emerald-400" /> {quote.requirementId?.duration} Days</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                                <p className="text-gray-400 text-sm uppercase tracking-wider">Prepared For</p>
                                <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2 justify-end">
                                    <FaUser className="text-lg" />
                                    {quote.requirementId?.contactInfo?.name || 'Valued Traveler'}
                                </h2>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 no-print">
                                <button
                                    onClick={handleGenerateItinerary}
                                    disabled={generatingItinerary}
                                    className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {generatingItinerary ? <FaSpinner className="animate-spin" /> : <FaMap />}
                                    {itinerary.length > 0 ? 'Regenerate Plan' : 'AI Itinerary'}
                                </button>

                                {itinerary.length > 0 && (
                                    <button
                                        onClick={handleDownloadPdf}
                                        disabled={downloadingPdf}
                                        className="bg-zinc-800 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-700 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {downloadingPdf ? <FaSpinner className="animate-spin" /> : <FaFilePdf className="text-red-400" />}
                                        PDF
                                    </button>
                                )}

                                <div className="h-8 w-[1px] bg-white/10 mx-1 hidden sm:block" />

                                <button
                                    onClick={handleSave}
                                    disabled={saving || sending}
                                    className="bg-zinc-800 text-white border border-white/10 px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-700 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                    Save
                                </button>
                                
                                <button
                                    onClick={handleSend}
                                    disabled={saving || sending}
                                    className="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {sending ? <FaSpinner className="animate-spin" /> : <FaEnvelope />}
                                    Send to Client
                                </button>
                            </div>
                        </div>
                    </div>

                    {itineraryError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400 text-sm flex items-center gap-3"
                        >
                            <span>⚠️</span> {itineraryError}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                    <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><FaHotel /></span>
                                    Accommodation
                                </h3>
                                <div className="space-y-4">
                                    {quote.sections?.hotels?.map((hotel: any, index: number) => (
                                        <div key={index} className="bg-black/40 rounded-xl p-4 border border-white/5 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-lg">{hotel.name}</h4>
                                                <p className="text-gray-400 text-sm">{hotel.city} • {hotel.roomType} • {hotel.nights} Nights</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-emerald-400 font-bold">₹{hotel.total?.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">₹{hotel.unitPrice?.toLocaleString()} / night</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <FaPlane className="text-blue-400" /> Transport
                                    </h3>
                                    <div className="space-y-3">
                                        {quote.sections?.transport?.map((t: any, i: number) => (
                                            <div key={i} className="text-sm bg-black/40 p-3 rounded-lg flex justify-between">
                                                <span>{t.type}</span>
                                                <span className="text-emerald-400">₹{t.total?.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <FaTicketAlt className="text-purple-400" /> Activities
                                    </h3>
                                    <div className="space-y-3">
                                        {quote.sections?.activities?.map((a: any, i: number) => (
                                            <div key={i} className="text-sm bg-black/40 p-3 rounded-lg flex justify-between">
                                                <span className="truncate max-w-[120px]">{a.name}</span>
                                                <span className="text-emerald-400">₹{a.total?.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {itinerary.length > 0 && (
                                <div className="mt-4">
                                    <ItineraryTimeline
                                        days={itinerary}
                                        destination={quote?.requirementId?.destination || ''}
                                        onRegenerate={handleGenerateItinerary}
                                        isRegenerating={generatingItinerary}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sticky top-24 no-print">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                    <span className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><FaCalculator /></span>
                                    Pricing
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Net Cost</label>
                                        <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-gray-400">
                                            ₹ {costs.net.toLocaleString()}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Margin Percentage (%)</label>
                                        <input
                                            type="number"
                                            value={costs.margin}
                                            onChange={(e) => setCosts({ ...costs, margin: parseFloat(e.target.value) || 0 })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-white/10 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">Our Profit</span>
                                            <span className="text-emerald-400 font-bold">₹{(costs.final - costs.net).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">Per Person</span>
                                            <span className="text-white font-bold">₹{costs.perHead.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mt-4">
                                            <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1 font-bold">Total Quote Price</p>
                                            <p className="text-3xl font-bold text-white">₹{costs.final.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteEditor;