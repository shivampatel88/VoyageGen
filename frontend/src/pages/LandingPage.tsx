import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Statistics from '../components/Statistics';
import ScrollJourney from '../components/ScrollJourney';
import HowItWorks from '../components/HowItWorks';
import AIShowcase from '../components/AIShowcase';
import FeatureBento from '../components/FeatureBento';
import ComparisonTable from '../components/ComparisonTable';
import DestinationShowcase from '../components/DestinationShowcase';
import TestimonialWall from '../components/TestimonialWall';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden">
            <Header />
            <main>
                <div id="home"><Hero /></div>
                <TrustBar />
                <Statistics />
                <ScrollJourney />
                <HowItWorks />
                <AIShowcase />
                <FeatureBento />
                <ComparisonTable />
                <DestinationShowcase />
                <TestimonialWall />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
