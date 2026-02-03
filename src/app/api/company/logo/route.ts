import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { uploadCompanyLogo, deleteFromS3 } from '@/lib/s3/client'

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const supabase = createAdminClient()

        // Get company
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('id, logo_url, plan')
            .eq('clerk_user_id', userId)
            .single()

        if (companyError || !company) {
            return NextResponse.json(
                { success: false, error: 'Company not found' },
                { status: 404 }
            )
        }

        // Check if paid plan
        if (company.plan === 'free') {
            return NextResponse.json(
                { success: false, error: 'Logo upload requires a paid plan' },
                { status: 403 }
            )
        }

        // Get file from form data
        const formData = await request.formData()
        const file = formData.get('logo') as File | null

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            )
        }

        // Upload to S3
        const uploadResult = await uploadCompanyLogo(company.id, file)

        if (!uploadResult.success) {
            return NextResponse.json(
                { success: false, error: uploadResult.error },
                { status: 400 }
            )
        }

        // Delete old logo if exists
        if (company.logo_url) {
            try {
                const oldKey = company.logo_url.split('.amazonaws.com/')[1]
                if (oldKey) {
                    await deleteFromS3(oldKey)
                }
            } catch {
                // Ignore delete errors for old logo
            }
        }

        // Update company with new logo URL
        const { error: updateError } = await supabase
            .from('companies')
            .update({ logo_url: uploadResult.url })
            .eq('id', company.id)

        if (updateError) {
            return NextResponse.json(
                { success: false, error: 'Failed to update company' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            logoUrl: uploadResult.url,
        })
    } catch (error) {
        console.error('Logo upload error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const supabase = createAdminClient()

        // Get company
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('id, logo_url')
            .eq('clerk_user_id', userId)
            .single()

        if (companyError || !company) {
            return NextResponse.json(
                { success: false, error: 'Company not found' },
                { status: 404 }
            )
        }

        // Delete from S3 if exists
        if (company.logo_url) {
            try {
                const key = company.logo_url.split('.amazonaws.com/')[1]
                if (key) {
                    await deleteFromS3(key)
                }
            } catch {
                // Continue even if S3 delete fails
            }
        }

        // Remove logo URL from company
        const { error: updateError } = await supabase
            .from('companies')
            .update({ logo_url: null })
            .eq('id', company.id)

        if (updateError) {
            return NextResponse.json(
                { success: false, error: 'Failed to update company' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Logo delete error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
