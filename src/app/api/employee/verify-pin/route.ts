import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payslipId, pin } = body;

    if (!payslipId || !pin) {
      return NextResponse.json(
        { success: false, error: "Payslip ID and PIN are required" },
        { status: 400 },
      );
    }

    // Validate PIN format (DDMMYYYY)
    if (pin.length !== 8 || !/^\d{8}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: "Invalid PIN format. Use DDMMYYYY format." },
        { status: 400 },
      );
    }

    // Parse PIN to date
    const day = parseInt(pin.substring(0, 2), 10);
    const month = parseInt(pin.substring(2, 4), 10);
    const year = parseInt(pin.substring(4, 8), 10);

    // Basic validation
    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > 2100
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid date. Please enter a valid date." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Get payslip with employee
    const { data: payslip, error } = await supabase
      .from("payslips")
      .select(
        `
                id,
                employee:employees(
                    date_of_birth
                )
            `,
      )
      .eq("id", payslipId)
      .single();

    if (error || !payslip) {
      return NextResponse.json(
        { success: false, error: "Payslip not found" },
        { status: 404 },
      );
    }
    const employeeData = (
      payslip as { employee: { date_of_birth: string | null }[] }
    ).employee;
    const employee = employeeData?.[0] || null;

    if (!employee?.date_of_birth) {
      // No DOB set, set auth cookie directly
      const cookieStore = await cookies();
      cookieStore.set(`payslip_auth_${payslipId}`, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return NextResponse.json({ success: true });
    }

    // Compare with stored date of birth
    const dob = new Date(employee.date_of_birth);
    const enteredDate = new Date(year, month - 1, day);

    // Compare dates (ignore time)
    const dobDay = dob.getDate();
    const dobMonth = dob.getMonth() + 1;
    const dobYear = dob.getFullYear();

    if (day !== dobDay || month !== dobMonth || year !== dobYear) {
      return NextResponse.json(
        { success: false, error: "Incorrect PIN. Please try again." },
        { status: 401 },
      );
    }

    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set(`payslip_auth_${payslipId}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PIN verification error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 },
    );
  }
}
