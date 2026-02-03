'use server'

import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

// Use admin client since we verify auth with Clerk
// This bypasses RLS but is safe because we check userId

// ============ TYPES ============

interface Company {
    id: string
    clerk_user_id: string
    name: string
    logo_url: string | null
    address: string | null
    tax_number: string | null
    plan: 'free' | 'basic' | 'pro'
    created_at: string
    updated_at: string
}

interface Employee {
    id: string
    company_id: string
    name: string
    email: string | null
    employee_code: string | null
    position: string | null
    phone: string | null
    date_of_birth: string | null
    pin_hash: string | null
    salary_details: Record<string, unknown> | null
    // New fields for professional payslip
    address: string | null
    id_number: string | null
    ss_number: string | null
    department: string | null
    section: string | null
    unit: string | null
    grade: string | null
    created_at: string
    updated_at: string
}

interface Payslip {
    id: string
    company_id: string
    employee_id: string
    period_month: number
    period_year: number
    gross_salary: number
    net_salary: number
    deductions: Record<string, unknown>
    pdf_url: string | null
    access_token: string
    created_at: string
}

// ============ COMPANY ACTIONS ============

export async function getCompany(): Promise<Company | null> {
    const { userId } = await auth()
    if (!userId) return null

    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('clerk_user_id', userId)
        .single()

    if (error) {
        console.error('Error fetching company:', error)
        return null
    }

    return data as Company
}

export async function createCompany(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { success: false, error: 'Not authenticated' }

    const name = formData.get('name') as string
    const address = formData.get('address') as string | null
    const taxNumber = formData.get('taxNumber') as string | null

    if (!name || name.trim().length < 2) {
        return { success: false, error: 'Company name is required' }
    }

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('companies')
        .insert({
            clerk_user_id: userId,
            name: name.trim(),
            address: address?.trim() || null,
            tax_number: taxNumber?.trim() || null,
            plan: 'free',
        })

    if (error) {
        console.error('Error creating company:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateCompany(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const { userId } = await auth()
    if (!userId) return { success: false, error: 'Not authenticated' }

    const name = formData.get('name') as string
    const address = formData.get('address') as string | null
    const taxNumber = formData.get('taxNumber') as string | null

    const supabase = createAdminClient()

    const { error } = await supabase
        .from('companies')
        .update({
            name: name.trim(),
            address: address?.trim() || null,
            tax_number: taxNumber?.trim() || null,
        })
        .eq('clerk_user_id', userId)

    if (error) {
        console.error('Error updating company:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

// ============ EMPLOYEE ACTIONS ============

export async function getEmployees(): Promise<Employee[]> {
    const { userId } = await auth()
    if (!userId) return []

    const supabase = createAdminClient()

    // First get the company
    const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('clerk_user_id', userId)
        .single()

    if (!company) return []

    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', (company as { id: string }).id)
        .order('name')

    if (error) {
        console.error('Error fetching employees:', error)
        return []
    }

    return (data as Employee[]) || []
}

export async function createEmployee(formData: FormData): Promise<{ success: boolean; error?: string; employee?: Employee }> {
    const { userId } = await auth()
    if (!userId) return { success: false, error: 'Not authenticated' }

    const supabase = createAdminClient()

    // Get company
    const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('clerk_user_id', userId)
        .single()

    if (!company) return { success: false, error: 'Company not found' }

    const name = formData.get('name') as string
    const email = formData.get('email') as string | null
    const employeeCode = formData.get('employeeCode') as string | null
    const position = formData.get('position') as string | null
    const phone = formData.get('phone') as string | null
    const dateOfBirth = formData.get('dateOfBirth') as string | null
    // New professional payslip fields
    const address = formData.get('address') as string | null
    const idNumber = formData.get('idNumber') as string | null
    const ssNumber = formData.get('ssNumber') as string | null
    const department = formData.get('department') as string | null
    const section = formData.get('section') as string | null
    const unit = formData.get('unit') as string | null
    const grade = formData.get('grade') as string | null

    if (!name || name.trim().length < 2) {
        return { success: false, error: 'Employee name is required' }
    }

    const { data, error } = await supabase
        .from('employees')
        .insert({
            company_id: (company as { id: string }).id,
            name: name.trim(),
            email: email?.trim() || null,
            employee_code: employeeCode?.trim() || null,
            position: position?.trim() || null,
            phone: phone?.trim() || null,
            date_of_birth: dateOfBirth || null,
            // New fields
            address: address?.trim() || null,
            id_number: idNumber?.trim() || null,
            ss_number: ssNumber?.trim() || null,
            department: department?.trim() || null,
            section: section?.trim() || null,
            unit: unit?.trim() || null,
            grade: grade?.trim() || null,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating employee:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/employees')
    return { success: true, employee: data as Employee }
}

// ============ USAGE & LIMITS ============

// Plan limits:
// Free: 2 employees, 2 payslips per month
// Basic: 10 employees, 10 payslips per month  
// Pro: Unlimited

const PLAN_LIMITS = {
    free: { employees: 2, payslipsPerMonth: 2 },
    basic: { employees: 10, payslipsPerMonth: 10 },
    pro: { employees: 100, payslipsPerMonth: 100 },
}

export async function getUsageLimits(): Promise<{
    employees: { used: number; limit: number };
    payslips: { used: number; limit: number };
    plan: string;
}> {
    const { userId } = await auth()
    if (!userId) return {
        employees: { used: 0, limit: 2 },
        payslips: { used: 0, limit: 2 },
        plan: 'free'
    }

    const supabase = createAdminClient()

    // Get company with plan
    const { data: company } = await supabase
        .from('companies')
        .select('id, plan')
        .eq('clerk_user_id', userId)
        .single()

    if (!company) return {
        employees: { used: 0, limit: 2 },
        payslips: { used: 0, limit: 2 },
        plan: 'free'
    }

    const companyData = company as { id: string; plan: 'free' | 'basic' | 'pro' }
    const limits = PLAN_LIMITS[companyData.plan] || PLAN_LIMITS.free

    // Count employees
    const { count: employeeCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyData.id)

    // Count payslips this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

    const { count: payslipCount } = await supabase
        .from('payslips')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyData.id)
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth)

    return {
        employees: { used: employeeCount ?? 0, limit: limits.employees },
        payslips: { used: payslipCount ?? 0, limit: limits.payslipsPerMonth },
        plan: companyData.plan,
    }
}

export async function canAddEmployee(): Promise<{ allowed: boolean; message?: string }> {
    const usage = await getUsageLimits()
    if (usage.employees.used >= usage.employees.limit) {
        return {
            allowed: false,
            message: `With the ${usage.plan === 'free' ? 'Free' : 'Basic'} plan, you can add up to ${usage.employees.limit} employees. Upgrade your plan for more.`
        }
    }
    return { allowed: true }
}

export async function canGeneratePayslip(): Promise<{ allowed: boolean; message?: string }> {
    const usage = await getUsageLimits()
    if (usage.payslips.used >= usage.payslips.limit) {
        return {
            allowed: false,
            message: `You have reached your limit of ${usage.payslips.limit} payslips this month. Upgrade your plan or try again next month.`
        }
    }
    return { allowed: true }
}

// ============ PAYSLIP ACTIONS ============

export async function getRecentPayslips(limit = 5): Promise<(Payslip & { employee: Employee })[]> {
    const { userId } = await auth()
    if (!userId) return []

    const supabase = createAdminClient()

    // Get company
    const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('clerk_user_id', userId)
        .single()

    if (!company) return []

    const { data, error } = await supabase
        .from('payslips')
        .select(`
      *,
      employee:employees(*)
    `)
        .eq('company_id', (company as { id: string }).id)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching payslips:', error)
        return []
    }

    return (data as (Payslip & { employee: Employee })[]) || []
}

export async function getYearToDateTotals(employeeId: string, year: number, upToMonth: number): Promise<{
    grossTotal: number;
    taxTotal: number;
    sscTotal: number;
    netTotal: number;
}> {
    const { userId } = await auth()
    if (!userId) return { grossTotal: 0, taxTotal: 0, sscTotal: 0, netTotal: 0 }

    const supabase = createAdminClient()

    // Get company first to verify ownership
    const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('clerk_user_id', userId)
        .single()

    if (!company) return { grossTotal: 0, taxTotal: 0, sscTotal: 0, netTotal: 0 }

    // Get all payslips for this employee in this year up to the specified month
    const { data: payslips, error } = await supabase
        .from('payslips')
        .select('gross_salary, net_salary, deductions')
        .eq('employee_id', employeeId)
        .eq('company_id', (company as { id: string }).id)
        .eq('period_year', year)
        .lte('period_month', upToMonth)

    if (error || !payslips) {
        console.error('Error fetching YTD totals:', error)
        return { grossTotal: 0, taxTotal: 0, sscTotal: 0, netTotal: 0 }
    }

    // Sum up all the values
    let grossTotal = 0
    let taxTotal = 0
    let sscTotal = 0
    let netTotal = 0

    for (const payslip of payslips) {
        grossTotal += payslip.gross_salary || 0
        netTotal += payslip.net_salary || 0
        const deductions = payslip.deductions as { incomeTax?: number; sscEmployee?: number } | null
        if (deductions) {
            taxTotal += deductions.incomeTax || 0
            sscTotal += deductions.sscEmployee || 0
        }
    }

    return { grossTotal, taxTotal, sscTotal, netTotal }
}

export async function getPayslipById(payslipId: string): Promise<(Payslip & { employee: Employee; company: Company }) | null> {
    const { userId } = await auth()
    if (!userId) return null

    const supabase = createAdminClient()

    // Get company first to verify ownership
    const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('clerk_user_id', userId)
        .single()

    if (!company) return null

    const { data, error } = await supabase
        .from('payslips')
        .select(`
      *,
      employee:employees(*)
    `)
        .eq('id', payslipId)
        .eq('company_id', (company as Company).id)
        .single()

    if (error || !data) {
        console.error('Error fetching payslip:', error)
        return null
    }

    return {
        ...(data as Payslip & { employee: Employee }),
        company: company as Company
    }
}
