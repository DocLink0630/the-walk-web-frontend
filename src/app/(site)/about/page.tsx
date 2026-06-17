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
          type: "image",
          src: "/images/about2.jpeg",
          alt: "The Walk Agency",
        }}
        overlay="dark"
        showScrollIndicator={false}
      />
      <BrandStorySection />
      <FounderSection />
    </main>
  );
}
