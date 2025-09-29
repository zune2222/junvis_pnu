import { Header } from '../../widgets/Header'
import { HeroSection } from '../../widgets/HeroSection'
import { FeatureSection } from '../../widgets/FeatureSection'
import { CTASection } from '../../widgets/CTASection'
import { Footer } from '../../widgets/Footer'

export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}