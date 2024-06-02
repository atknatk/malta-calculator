"use client"
import {
  Gauge,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { Month, MonthlySalaryInput, MonthlySalaryOutput } from "@/types/salary-calculator-type";
import { SalaryFormCard } from "@/components/salary/form-card";
import { SalaryCalculatorForm } from "./salary-input-form";
import { SalaryTable } from "./salary-table";
import { ZodFirstPartySchemaTypes, z } from "zod";
import { calculateMonthlyDeductions } from "@/utils/salary-calculator";

export function SalaryCalculatorClient({ children }: any) {
  const [data, setData] = useState<MonthlySalaryOutput[]>([]);
  const [values, setValues] = useState<z.infer<ZodFirstPartySchemaTypes>>({});
  const isUpdatingRef = React.useRef(false);
  const previousDataRef = React.useRef<MonthlySalaryOutput[]>(data);



  React.useEffect(() => {
    const monthlySalaries: MonthlySalaryInput[] = [];
    for (const month of Object.values(Month)) {
      monthlySalaries.push({
        month,
        additionalAmount: 0,
        grossWage: values.grossSalary
      });
    }
    const val = calculateMonthlyDeductions(monthlySalaries)
    setData(val);
  }, [values]);


  React.useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      previousDataRef.current = data;
      return;
    }
    if (data.length === 0) return;
    // Get the index of the last changed item
    const lastChangedIndex = data.findIndex((item, index) => {
      return item.grossWage !== previousDataRef.current[index]?.grossWage;
    });

    if (lastChangedIndex === -1 || lastChangedIndex === data.length - 1) {
      previousDataRef.current = data;
      return;
    }
    // Create a new array with updated values for subsequent rows
    const updatedData = data.map((item, index) => {
      if (index > lastChangedIndex) {
        return { ...item, grossWage: data[lastChangedIndex].grossWage };
      }
      return item;
    });
    
    isUpdatingRef.current = true;
    const monthlySalaries: MonthlySalaryInput[] = [];
    for (const line of updatedData) {
      monthlySalaries.push({
        month: line.month,
        additionalAmount: 0,
        grossWage: line.grossWage
      });
    }
    const calculatedData = calculateMonthlyDeductions(monthlySalaries)
    
    setData(calculatedData);
    
  }, [data]);

  return (
    <>
      <SalaryFormCard
        title="Salary Calculator"
        variant="primary"
        icon={Gauge}
        className={"sm:col-span-3"}
      >
        <SalaryCalculatorForm values={values} onValuesChange={setValues} />
      </SalaryFormCard>
      {children}
      <SalaryFormCard title="Result" className={"sm:col-span-3"}>
        <SalaryTable data={data} setData={setData} />
      </SalaryFormCard>
    </>
  );
}
