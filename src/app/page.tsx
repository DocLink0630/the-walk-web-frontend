import Hero from "@/components/Hero";
import heroPoster from "@/assets/images/hero.webp";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import TalentSection from "@/components/TalentSection";
import BlackSection from "@/components/BlackSection";
import PlatformStrip from "@/components/PlatformStripe";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero
        heading="The Walk Academy"
        background={{
          type: "video",
          src: "/videos/background.mp4",
          poster: heroPoster,
        }}
        ctas={[
          { label: "Browse Models", href: "/models", variant: "primary" },
          { label: "Make Inquiry", href: "/inquiry", variant: "secondary" },
        ]}
      />
      <WhatWeDoSection/>
      <TalentSection/>
      <BlackSection/>
      <PlatformStrip/>
      <ContactSection/>
    </main>
  );
}
