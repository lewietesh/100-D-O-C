// app/services/page.tsx
import Hero from '@/components/Hero'


// Service-specific layout components
import PageLayout from '@/components/services/PageLayout'

const heroData = {
        title: 'Digital Solutions',
        subtitle: 'Explore our service offerings tailored to your business growth.',
}

const serviceId = 'digital-solutions'
const service = {
        title: 'Digital Solutions',
        imageUrl:
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
        description: `We provide cutting-edge digital products tailored for business growth. From design to deployment, our services ensure modern user experiences with top-tier performance.`,
}

export default function ServicesPage() {
        return (
                <>
                        <Hero title={heroData.title} subtitle={heroData.subtitle} />

                        <main className="bg-white py-16">
                                <div className="container mx-auto px-4">
                                        <PageLayout serviceId={serviceId} service={service} />        </div>
                        </main>

                </>
        )
}
