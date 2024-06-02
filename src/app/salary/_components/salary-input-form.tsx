"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { ZodFirstPartySchemaTypes, z } from "zod";
import { Month } from "@/types/salary-calculator-type";
import { useEffect, useState } from "react";
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


export function SalaryCalculatorForm({
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
}: {
  values?: Partial<z.infer<ZodFirstPartySchemaTypes>>;
  onValuesChange?: (values: Partial<z.infer<ZodFirstPartySchemaTypes>>) => void;
}) {
  useEffect(() => {
    const input = document.getElementById('gross-salary-input');
    if (input) {
      input.addEventListener('focus', (e: any) => {
        e.target?.select();
      });

      return () => {
        input.removeEventListener('focus', (e: any) => {
          e.target?.select();
        });
      };
    }
  }, []);

  return (
    <AutoForm
    values={valuesProp} 
    onValuesChange={onValuesChangeProp}
    formSchema={formSchema}
    fieldConfig={{
      grossSalary: {
        inputProps: {
           id: 'gross-salary-input'
        }
      }
    }}
    >
    {/* <AutoFormSubmit>Calculate</AutoFormSubmit> */}
  </AutoForm>
  );
}
