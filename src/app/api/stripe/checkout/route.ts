import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getStripe, PLANS, PlanType } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const plan = body.plan as PlanType;

        if (!plan || !PLANS[plan] || plan === 'free') {
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            );
        }

        const priceId = PLANS[plan].priceId;

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price ID not configured' },
                { status: 500 }
            );
        }

        // Get company ID for metadata
        const supabase = createAdminClient();
        const { data: company } = await supabase
            .from('companies')
            .select('id')
            .eq('clerk_user_id', userId)
            .single();

        if (!company) {
            return NextResponse.json(
                { error: 'Company not found. Please complete onboarding first.' },
                { status: 400 }
            );
        }

        const stripe = getStripe();

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${request.nextUrl.origin}/dashboard?upgrade=success`,
            cancel_url: `${request.nextUrl.origin}/pricing?upgrade=cancelled`,
            metadata: {
                userId,
                companyId: company.id,
                plan,
            },
            subscription_data: {
                metadata: {
                    userId,
                    companyId: company.id,
                    plan,
                },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
