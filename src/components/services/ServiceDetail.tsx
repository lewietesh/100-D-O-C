'use client';

interface ServiceDetailProps {
        title: string;
        imageUrl: string;
        description: string;
}

export default function ServiceDetail({ title, imageUrl, description }: ServiceDetailProps) {
        return (
                <section className="space-y-6">
                        <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>

                        <img
                                src={imageUrl}
                                alt={title}
                                className="w-full max-w-2xl h-auto rounded-lg shadow-md object-cover"
                        />

                        <p className="text-gray-700 leading-relaxed">{description}</p>
                </section>
        );
}
