'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
    plan: 'free' | 'basic' | 'pro';
    name: string;
    price: number;
    features: string[];
    isLoggedIn: boolean;
    isCurrent: boolean;
    isPopular?: boolean;
}

export default function PricingCard({
    plan,
    name,
    price,
    features,
    isLoggedIn,
    isCurrent,
    isPopular = false,
}: PricingCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (plan === 'free') {
            router.push('/sign-up');
            return;
        }

        if (!isLoggedIn) {
            router.push('/sign-in?redirect_url=/pricing');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No checkout URL returned');
                setLoading(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setLoading(false);
        }
    };

    return (
        <div
            className={`relative rounded-2xl border ${isPopular
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10'
                    : 'border-slate-200 dark:border-slate-700'
                } bg-white p-6 dark:bg-slate-800`}
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                        Most Popular
                    </span>
                </div>
            )}

            {/* Plan Name */}
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                {name}
            </h3>

            {/* Price */}
            <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    €{price}
                </span>
                {price > 0 && (
                    <span className="text-slate-500 dark:text-slate-400">/month</span>
                )}
            </div>

            {/* Features */}
            <ul className="mb-6 space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <svg
                            className="h-5 w-5 flex-shrink-0 text-amber-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                onClick={handleUpgrade}
                disabled={loading || isCurrent}
                className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition ${isPopular
                        ? 'bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-400'
                        : plan === 'free'
                            ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
                            : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                    } disabled:cursor-not-allowed`}
            >
                {loading ? (
                    'Loading...'
                ) : isCurrent ? (
                    'Current Plan'
                ) : plan === 'free' ? (
                    'Get Started Free'
                ) : (
                    `Upgrade to ${name}`
                )}
            </button>
        </div>
    );
}
