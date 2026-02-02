import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import PayslipViewer from './_components/payslip-viewer';
import PinAuth from './_components/pin-auth';
import { cookies } from 'next/headers';

interface Payslip {
    id: string;
    period_month: number;
    period_year: number;
    gross_salary: number;
    net_salary: number;
    deductions: {
        incomeTax: number;
        sscEmployee: number;
    };
    created_at: string;
    access_token: string;
    employee: {
        id: string;
        name: string;
        position: string | null;
        employee_code: string | null;
        email: string | null;
        date_of_birth: string | null;
    };
    company: {
        name: string;
        address: string | null;
        tax_number: string | null;
        logo_url: string | null;
        plan: 'free' | 'basic' | 'pro';
    };
}

async function getPayslipByToken(token: string): Promise<Payslip | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('payslips')
        .select(`
            *,
            employee:employees(*),
            company:companies(*)
        `)
        .eq('access_token', token)
        .single();

    if (error || !data) {
        return null;
    }

    return data as unknown as Payslip;
}

export default async function EmployeeViewPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const payslip = await getPayslipByToken(token);

    if (!payslip) {
        notFound();
    }

    // Check if user is authenticated via cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(`payslip_auth_${payslip.id}`);
    const isAuthenticated = authCookie?.value === 'true';

    // If employee has date_of_birth and user is not authenticated, show PIN auth
    if (payslip.employee.date_of_birth && !isAuthenticated) {
        return (
            <PinAuth
                payslipId={payslip.id}
                employeeName={payslip.employee.name}
                token={token}
            />
        );
    }

    return (
        <PayslipViewer payslip={payslip} />
    );
}

export const metadata = {
    title: 'View Payslip',
    description: 'View your payslip securely',
};
