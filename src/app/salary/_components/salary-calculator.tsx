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

export function SalaryCalculatorClient({ children } : any) {
  const [data, setData] = useState<MonthlySalaryOutput[]>([]);
  const [values, setValues] = useState<z.infer<ZodFirstPartySchemaTypes>>({});

  React.useEffect(() => {
  //   const monthlySalaries: MonthlySalaryInput[] = [
  //     { month: Month.January, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.February, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.March, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.April, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.May, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.June, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.July, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.August, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.September, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.October, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.November, grossWage: 3000, additionalAmount: 500 },
  //     { month: Month.December, grossWage: 3000, additionalAmount: 500 },
  // ];
  const monthlySalaries : MonthlySalaryInput[] = [];
  for (const month of Object.values(Month)) {
    monthlySalaries.push({
      month,
      additionalAmount : 0,
      grossWage : values.grossSalary
    });
  }
      const val =calculateMonthlyDeductions(monthlySalaries)
      console.log(values);
      console.log(monthlySalaries);
      
      setData(val);
  }, [values]);


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
          <SalaryTable data={data} setData={setData}/>
        </SalaryFormCard>
    </>
  );
}
