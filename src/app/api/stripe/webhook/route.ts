import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('STRIPE_WEBHOOK_SECRET not configured');
        return NextResponse.json(
            { error: 'Webhook not configured' },
            { status: 500 }
        );
    }

    let event: Stripe.Event;

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    const supabase = createAdminClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const { companyId, plan } = session.metadata || {};

                if (companyId && plan) {
                    await supabase
                        .from('companies')
                        .update({
                            plan: plan as 'basic' | 'pro',
                            stripe_customer_id: session.customer as string,
                            stripe_subscription_id: session.subscription as string,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', companyId);

                    console.log(`✅ Upgraded company ${companyId} to ${plan}`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const { companyId } = subscription.metadata || {};

                if (companyId) {
                    await supabase
                        .from('companies')
                        .update({
                            plan: 'free',
                            stripe_subscription_id: null,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', companyId);

                    console.log(`⬇️ Downgraded company ${companyId} to free`);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const { companyId, plan } = subscription.metadata || {};

                if (companyId && subscription.status === 'active') {
                    await supabase
                        .from('companies')
                        .update({
                            plan: plan as 'basic' | 'pro',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', companyId);

                    console.log(`🔄 Updated company ${companyId} subscription`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
