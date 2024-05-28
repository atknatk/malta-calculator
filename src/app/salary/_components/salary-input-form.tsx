"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { z } from "zod";
import { Month } from "@/types/salary-calculator-type";
const monthValues = Object.values(Month) as [Month, ...Month[]];

// Define your form schema using zod
const formSchema = z.object({
    grossSalary: z.number().min(0, {
        message: "Gross salary must be at least 0.",
      }).max(1000000, {
        message: "Gross salary must be at most 1000000.",
      }).default(15000),
    year: z.enum(["2024", "2023", "2022", "2021", "2020"]).default("2024"),
    startOfMonth: z.enum(monthValues).default(Month.January),
    endOfMonth: z.enum(monthValues).default(Month.December),
    cumulativeIncomeTaxBase: z.number().min(0, {
        message: "Cumulative Income Tax Base must be at least 0.",
      }).max(1000000, {
        message: "Cumulative Income Tax Base must be at most 1000000.",
      }).default(0),
  });
  

export function SalaryCalculatorForm() {
 

  return (
    <AutoForm
    formSchema={formSchema}>
    {/* <AutoFormSubmit>Calculate</AutoFormSubmit> */}
  </AutoForm>
  );
}
