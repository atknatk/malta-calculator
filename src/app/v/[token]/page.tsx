import { redirect } from 'next/navigation'

interface ShortVerifyPageProps {
    params: Promise<{ token: string }>
}

export default async function ShortVerifyPage({ params }: ShortVerifyPageProps) {
    const { token } = await params
    redirect(`/payslip/verify/${token}`)
}
