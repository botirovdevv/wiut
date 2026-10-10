import FeatureBento from "@/components/landing/FeatureBento";
import FinalCta from "@/components/landing/FinalCta";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import ProblemStatement from "@/components/landing/ProblemStatement";
import SpeedSection from "@/components/landing/SpeedSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemStatement />
      <HowItWorks />
      <FeatureBento />
      <SpeedSection />
      <FinalCta />
    </>
  );
}
