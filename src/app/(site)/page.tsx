import Hero from "@/components/Hero";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import TalentSection from "@/components/TalentSection";
import BlackSection from "@/components/BlackSection";
import ModelRegistrationCTA from "@/components/ModelRegistrationCTA";
import AcademyCTA from "@/components/AcademyCTA";
import PlatformStrip from "@/components/PlatformStripe";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero
        heading="The Walk Agency"
        eyebrow="MODEL AGENCY · Sri Lanka"
        tagline="Sri Lanka's premier modelling agency. Verified talent. Direct bookings."
        sideLabel="Model · Beautician · Photographer"
        background={{
          type: "video",
          src: "/videos/about.mp4",
          poster: "/images/hero.webp",
        }}
        ctas={[
          { label: "Explore Talent", href: "/models", variant: "primary" },
          { label: "Apply Now", action: "open-apply", variant: "secondary" },
        ]}
      />
      <TalentSection/>
      <WhatWeDoSection/>
      <ModelRegistrationCTA/>
      <AcademyCTA/>
      <PlatformStrip/>
      <BlackSection/>
      <ContactSection/>
    </main>
  );
}
