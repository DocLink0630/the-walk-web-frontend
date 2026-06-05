import BrandStorySection from "@/components/BrandStorySection";
import FounderSection from "@/components/FounderSection";
import Hero from "@/components/Hero";

export default function About() {
  return (
    <main className="flex-1">
      <Hero
        heading="About Us"
        eyebrow="The Walk Agency"
        tagline="Connecting Sri Lanka's creative talent with the clients who need them."
        background={{
          type: "video",
          src: "/videos/background.mp4",
          poster: "/images/hero.webp",
        }}
        showScrollIndicator={false}
      />
      <BrandStorySection />
      <FounderSection />
    </main>
  );
}
