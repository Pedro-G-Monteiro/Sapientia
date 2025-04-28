import FAQ from '@/components/ui/LandingPage/Body/FAQ';
import Footer from '@/components/ui/LandingPage/Body/Footer';
import HeroSection from '@/components/ui/LandingPage/Body/HeroSection';
import KnowledgeHub from '@/components/ui/LandingPage/Body/KnowledgeHub';
import OrganizationBenefits from '@/components/ui/LandingPage/Body/OrganizationBenefits';
import LandingHeader from '@/components/ui/LandingPage/Header/LandingHeader';
import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div>
      <LandingHeader />
      <HeroSection />
      <KnowledgeHub />
      <OrganizationBenefits />
      <FAQ />
      <Footer />
    </div>
  );
}

export default LandingPage;