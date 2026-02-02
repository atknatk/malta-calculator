export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type SubscriptionPlan = 'free' | 'basic' | 'pro'

export interface Database {
    public: {
        Tables: {
            companies: {
                Row: {
                    id: string
                    clerk_user_id: string
                    name: string
                    logo_url: string | null
                    address: string | null
                    tax_number: string | null
                    plan: SubscriptionPlan
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    clerk_user_id: string
                    name: string
                    logo_url?: string | null
                    address?: string | null
                    tax_number?: string | null
                    plan?: SubscriptionPlan
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    clerk_user_id?: string
                    name?: string
                    logo_url?: string | null
                    address?: string | null
                    tax_number?: string | null
                    plan?: SubscriptionPlan
                    created_at?: string
                    updated_at?: string
                }
            }
            employees: {
                Row: {
                    id: string
                    company_id: string
                    name: string
                    email: string | null
                    employee_code: string | null
                    position: string | null
                    phone: string | null
                    date_of_birth: string | null
                    pin_hash: string | null
                    salary_details: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    company_id: string
                    name: string
                    email?: string | null
                    employee_code?: string | null
                    position?: string | null
                    phone?: string | null
                    date_of_birth?: string | null
                    pin_hash?: string | null
                    salary_details?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    company_id?: string
                    name?: string
                    email?: string | null
                    employee_code?: string | null
                    position?: string | null
                    phone?: string | null
                    date_of_birth?: string | null
                    pin_hash?: string | null
                    salary_details?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            payslips: {
                Row: {
                    id: string
                    company_id: string
                    employee_id: string
                    period_month: number
                    period_year: number
                    gross_salary: number
                    net_salary: number
                    deductions: Json
                    pdf_url: string | null
                    access_token: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    company_id: string
                    employee_id: string
                    period_month: number
                    period_year: number
                    gross_salary: number
                    net_salary: number
                    deductions: Json
                    pdf_url?: string | null
                    access_token?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    company_id?: string
                    employee_id?: string
                    period_month?: number
                    period_year?: number
                    gross_salary?: number
                    net_salary?: number
                    deductions?: Json
                    pdf_url?: string | null
                    access_token?: string
                    created_at?: string
                }
            }
            daily_usage: {
                Row: {
                    id: string
                    company_id: string
                    date: string
                    payslips_generated: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    company_id: string
                    date: string
                    payslips_generated?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    company_id?: string
                    date?: string
                    payslips_generated?: number
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            subscription_plan: SubscriptionPlan
        }
    }
}

// Helper types
export type Company = Database['public']['Tables']['companies']['Row']
export type Employee = Database['public']['Tables']['employees']['Row']
export type Payslip = Database['public']['Tables']['payslips']['Row']
export type DailyUsage = Database['public']['Tables']['daily_usage']['Row']

export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type EmployeeInsert = Database['public']['Tables']['employees']['Insert']
export type PayslipInsert = Database['public']['Tables']['payslips']['Insert']
