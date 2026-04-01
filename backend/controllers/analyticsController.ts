import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Quote from '../models/Quote';
import { handleError } from '../utils/errorHandler';

// @desc    Get analytics metrics for the dashboard including Profit
// @route   GET /api/analytics/agent
// @access  Private (Agent/Admin)
export const getAgentAnalytics = async (req: Request, res: Response) => {
    try {
        // Determine scope: Admin sees all, Agent sees only their own
        const agentIdMatch = req.user?.role === 'ADMIN' ? {} : { agentId: new mongoose.Types.ObjectId(req.user!._id) };

        // 1. Conversion Funnel (Status counts)
        const statusCounts = await Quote.aggregate([
            { $match: agentIdMatch },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const funnel = {
            DRAFT: statusCounts.find(s => s._id === 'DRAFT')?.count || 0,
            READY: statusCounts.find(s => s._id === 'READY')?.count || 0,
            SENT_TO_USER: statusCounts.find(s => s._id === 'SENT_TO_USER')?.count || 0,
            ACCEPTED: statusCounts.find(s => s._id === 'ACCEPTED')?.count || 0,
            DECLINED: statusCounts.find(s => s._id === 'DECLINED')?.count || 0,
        };

        // 2. Revenue, Profit & Avg Value
        const revenueStats = await Quote.aggregate([
            { $match: { ...agentIdMatch, status: 'ACCEPTED' } },
            { 
                $group: { 
                    _id: null, 
                    totalRevenue: { $sum: '$costs.final' },
                    totalNet: { $sum: '$costs.net' }, // Sum of base costs
                    avgQuoteValue: { $avg: '$costs.final' },
                    count: { $sum: 1 }
                } 
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    avgQuoteValue: 1,
                    count: 1,
                    totalProfit: { $subtract: ['$totalRevenue', '$totalNet'] } // Profit = Final - Net
                }
            }
        ]);

        // 3. Top Destinations with Profit Margins
        const topDestinations = await Quote.aggregate([
            { $match: agentIdMatch },
            {
                $lookup: {
                    from: 'requirements',
                    localField: 'requirementId',
                    foreignField: '_id',
                    as: 'requirement'
                }
            },
            { $unwind: '$requirement' },
            { 
                $group: { 
                    _id: '$requirement.destination', 
                    count: { $sum: 1 }, 
                    revenue: { $sum: { $cond: [{ $eq: ['$status', 'ACCEPTED'] }, '$costs.final', 0] } },
                    profit: { 
                        $sum: { 
                            $cond: [
                                { $eq: ['$status', 'ACCEPTED'] }, 
                                { $subtract: ['$costs.final', '$costs.net'] }, 
                                0
                            ] 
                        } 
                    } 
                } 
            },
            { $sort: { profit: -1 } }, // Sort by most profitable destination
            { $limit: 10 }
        ]);

        // 4. Revenue & Profit Trend (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const revenueOverTime = await Quote.aggregate([
            { $match: { ...agentIdMatch, createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: { $cond: [{ $eq: ['$status', 'ACCEPTED'] }, '$costs.final', 0] } },
                    profit: { 
                        $sum: { 
                            $cond: [
                                { $eq: ['$status', 'ACCEPTED'] }, 
                                { $subtract: ['$costs.final', '$costs.net'] }, 
                                0
                            ] 
                        } 
                    },
                    quotes: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 5. Avg Response Time (From Created to First View)
        const responseTimes = await Quote.aggregate([
            { 
                $match: { 
                    ...agentIdMatch, 
                    viewedAt: { $exists: true },
                    createdAt: { $exists: true }
                } 
            },
            {
                $project: {
                    responseTime: { $subtract: ['$viewedAt', '$createdAt'] }
                }
            },
            { $group: { _id: null, avgResponseTime: { $avg: '$responseTime' } } }
        ]);

        // 6. Total View Counts
        const viewsCount = await Quote.countDocuments({ ...agentIdMatch, viewedAt: { $exists: true } });

        res.json({
            funnel,
            stats: revenueStats[0] || { totalRevenue: 0, totalProfit: 0, avgQuoteValue: 0, count: 0 },
            topDestinations,
            revenueOverTime,
            avgResponseTime: responseTimes[0]?.avgResponseTime || 0,
            viewsCount
        });

    } catch (error: unknown) {
        handleError(res, error, 'Analytics error');
    }
};