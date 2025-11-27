import { Metadata } from 'next';
import Dashboard from '@/components/studio/dashboard';

export const metadata: Metadata = {
    title: 'Studio Dashboard',
    description: 'Creator dashboard with performance insights and recent content',
};

export default function StudioPage() {
    return (
        <main className="min-h-screen bg-background pt-14">
            <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">Studio Dashboard</h1>
                <Dashboard />
            </div>
        </main>
    );
}
