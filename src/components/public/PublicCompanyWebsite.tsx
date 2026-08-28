import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { PublicNavbar } from "./PublicNavbar";
import { HeroSection } from "./HeroSection";
import { SchoolErpPackageSection } from "./SchoolErpPackageSection";
import { PosSystemPackageSection } from "./PosSystemPackageSection";
import { BusinessWebsitePackageSection } from "./BusinessWebsitePackageSection";
import { CustomSoftwarePackageSection } from "./CustomSoftwarePackageSection";
import { LiveDemosHub } from "./LiveDemosHub";
import { PackagesComparisonTable } from "./PackagesComparisonTable";
import { TestimonialsAndCaseStudies } from "./TestimonialsAndCaseStudies";
import { ConsultationQuoteForm } from "./ConsultationQuoteForm";
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
    <div id="davetech_public_website" className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Public Top Navigation */}
      <PublicNavbar
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
        onOpenNewTenantModal={onOpenNewTenantModal}
      />

      {/* 2. Hero Section with Interactive Package Switcher */}
      <HeroSection
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
        onOpenNewTenantModal={onOpenNewTenantModal}
      />

      {/* 3. Package 1: School ERP & Educational Cloud */}
      <SchoolErpPackageSection onOpenNewTenantModal={onOpenNewTenantModal} />

      {/* 4. Package 2: Point of Sale (POS) & Retail Inventory */}
      <PosSystemPackageSection onOpenPosModal={() => setPosModalOpen(true)} />

      {/* 5. Package 3: High-Converting Business Websites & CMS */}
      <BusinessWebsitePackageSection />

      {/* 6. Package 4: Custom Software & Cloud Engineering */}
      <CustomSoftwarePackageSection onOpenEstimatorModal={() => setEstimatorModalOpen(true)} />

      {/* 7. Live Interactive Demos Hub */}
      <LiveDemosHub
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
        onLaunchERP={() => setViewMode("erp")}
      />

      {/* 8. Comprehensive Packages Comparison Table */}
      <PackagesComparisonTable
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
        onLaunchERP={() => setViewMode("erp")}
      />

      {/* 9. Testimonials & Real-World Client Deployments */}
      <TestimonialsAndCaseStudies />

      {/* 10. Direct Consultation & Quotation Booking Form */}
      <ConsultationQuoteForm />

      {/* 11. Public Footer */}
      <PublicFooter
        onOpenPosModal={() => setPosModalOpen(true)}
        onOpenEstimatorModal={() => setEstimatorModalOpen(true)}
      />

      {/* Interactive POS Terminal Simulator Modal */}
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
