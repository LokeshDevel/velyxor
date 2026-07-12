import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCards } from '@/components/landing/FeatureCards';
import { GameModeShowcase } from '@/components/landing/GameModeShowcase';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeatureCards />
      <GameModeShowcase />
    </div>
  );
}
