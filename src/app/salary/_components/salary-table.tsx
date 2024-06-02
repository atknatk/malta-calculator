"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {  MonthlySalaryOutput } from "@/types/salary-calculator-type"
import { formatMoney } from "@/utils/money-format"

export const columns: ColumnDef<MonthlySalaryOutput>[] = [
  {
    accessorKey: "month",
    header: "Month",
    cell: ({ row }) => (
      <div className="capitalize font-bold">{row.getValue("month")}</div>
    ),
  },
  {
    accessorKey: "grossWage",
    header: "Gross Wage",
    cell: ({ row }) => <Input 
    onFocus={(e)=> {e.target.select()}} 
    className="w-[5rem]" 
    value={row.getValue("grossWage")}
    ></Input>,//<div>{row.getValue("grossSalary")}</div>,
  },
  {
    accessorKey: "basicSalary",
    header: "Basic Salary",
    cell: ({ row }) => <div className="font-bold">{formatMoney(row.getValue("basicSalary"))}</div>,
  },
  {
    accessorKey: "nonTaxBenefit",
    header: "Non-Tax Benefit",
    cell: ({ row }) => <div>{formatMoney(row.getValue("nonTaxBenefit"))}</div>,
  },
  {
    accessorKey: "taxBenefit",
    header: "Tax Benefit",
    cell: ({ row }) => <div>{formatMoney(row.getValue("taxBenefit"))}</div>,
  },
  {
    accessorKey: "bonus",
    header: "Bonus",
    cell: ({ row }) => <div>{formatMoney(row.getValue("bonus"))}</div>,
  },
  {
    accessorKey: "grossTotal",
    header: "Gross Total",
    cell: ({ row }) => <div>{formatMoney(row.getValue("grossTotal"))}</div>,
  },
  {
    accessorKey: "sscBase",
    header: "SSC Base",
    cell: ({ row }) => <div>{formatMoney(row.getValue("sscBase"))}</div>,
  },
  {
    accessorKey: "sscTax",
    header: "SSC Tax",
    cell: ({ row }) => <div>{formatMoney(row.getValue("sscTax"))}</div>,
  },
  {
    accessorKey: "incomeBase",
    header: "Income Base",
    cell: ({ row }) => <div>{formatMoney(row.getValue("incomeBase"))}</div>,
  },
  {
    accessorKey: "kumulativeIncomeBase",
    header: "Kumulative Income Base",
    cell: ({ row }) => <div>{formatMoney(row.getValue("kumulativeIncomeBase"))}</div>,
  },
  {
    accessorKey: "incomeTax",
    header: "Income Tax",
    cell: ({ row }) => <div>{formatMoney(row.getValue("incomeTax"))}</div>,
  },
  {
    accessorKey: "governmentBonus",
    header: "Government Bonus",
    cell: ({ row }) => <div>{formatMoney(row.getValue("governmentBonus"))}</div>,
  },
  {
    accessorKey: "net",
    header: "Net",
    cell: ({ row }) => <div>{formatMoney(row.getValue("net"))}</div>,
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ row }) => <div>{formatMoney(row.getValue("paid"))}</div>,
  },
  {
    accessorKey: "discr",
    header: "Discretionary",
    cell: ({ row }) => <div>{formatMoney(row.getValue("discr"))}</div>,
  },
]

export function SalaryTable({ data, setData }:
  {
    data: MonthlySalaryOutput[],
    setData: React.Dispatch<React.SetStateAction<MonthlySalaryOutput[]>>
  }
) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    //getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: 0, pageSize: data.length } 
    }
  })


  return (
    <div className="w-full">
      <div className="flex items-center py-4">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="p-1" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
