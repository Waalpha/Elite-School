import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { PublicNavbar } from "./PublicNavbar";
import { HeroSection } from "./HeroSection";
import { SolutionsSection } from "./SolutionsSection";
import { ProjectsSection } from "./ProjectsSection";
import { WhyDavetechSection } from "./WhyDavetechSection";
import { CtaSection } from "./CtaSection";
import { ContactSection } from "./ContactSection";
import { PublicFooter } from "./PublicFooter";
import { PosTerminalSimulatorModal } from "./PosTerminalSimulatorModal";
import { SoftwareEstimatorModal } from "./SoftwareEstimatorModal";

interface PublicCompanyWebsiteProps {
  onOpenNewTenantModal: () => void;
}

export const PublicCompanyWebsite: React.FC<PublicCompanyWebsiteProps> = ({
  onOpenNewTenantModal,
}) => {
  const { setViewMode } = useTenant();

  const [posModalOpen, setPosModalOpen] = useState(false);
  const [estimatorModalOpen, setEstimatorModalOpen] = useState(false);

  return (
    <div id="davetech_public_website" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-600 selection:text-white antialiased">
      {/* 1. Clean Sticky Header */}
      <PublicNavbar
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
        onOpenNewTenantModal={onOpenNewTenantModal}
      />

      {/* 2. Clean Split Hero Section with Modern Product Mockups */}
      <HeroSection
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
        onOpenNewTenantModal={onOpenNewTenantModal}
      />

      {/* 3. Solutions Built Around Your Business (4 Premium Cards) */}
      <SolutionsSection
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
      />

      {/* 4. Projects: Technology We've Built */}
      <ProjectsSection
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
      />

      {/* 5. Why Businesses Choose DAVETECH (4 Simple Features) */}
      <WhyDavetechSection />

      {/* 6. Call To Action (Strong Dark Section) */}
      <CtaSection />

      {/* 7. Contact Section (Thika, Kenya | 0707760239 / 0719176549 | support@davetech.co.ke | Clean Inquiry Form) */}
      <ContactSection />

      {/* 8. Clean Modern Footer */}
      <PublicFooter
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
      />

      {/* Interactive POS Simulator Modal */}
      <PosTerminalSimulatorModal
        isOpen={posModalOpen}
        onClose={() => setPosModalOpen(false)}
        onLaunchFullERP={() => setViewMode("erp")}
      />

      {/* Interactive Custom Software Estimator Modal */}
      <SoftwareEstimatorModal
        isOpen={estimatorModalOpen}
        onClose={() => setEstimatorModalOpen(false)}
      />
    </div>
  );
};
