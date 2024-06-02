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
  RowData
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
import { MonthlySalaryOutput } from "@/types/salary-calculator-type"
import { formatMoney } from "@/utils/money-format"
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

// Give our default column cell renderer editing superpowers!
const salaryDefaultColumn: Partial<ColumnDef<MonthlySalaryOutput>> = {

  accessorKey: "grossWage",
  header: "Gross Wage",
  cell: ({ getValue, row: { index }, column: { id }, table }) => {

  },
}

const EditableCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: {
  getValue: any;
  row: { index: number };
  column: { id: string };
  table: any;
}) => {
  const initialValue = getValue();
  const [value, setValue] = React.useState(initialValue)
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  return (
    <Input
      value={value as string}
      className="w-[5rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      type="number"
      step={50}
      onFocus={e => {e.target.select()}}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
    />
  )
};

const getColumns = (handleInputChange: (index: number, key: keyof MonthlySalaryOutput, value: string) => void): ColumnDef<MonthlySalaryOutput>[] => [
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
    cell: EditableCell,
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
  const handleInputChange = (index: number, key: keyof MonthlySalaryOutput, value: string) => {
    const updatedData: any = [...data];
    updatedData[index][key] = value;
    setData(updatedData);
  };

  const columns = React.useMemo(() => getColumns(handleInputChange), [data]);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex()
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: 0, pageSize: data.length },
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
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`${index === 0 ? 'sticky left-0 bg-white z-10' : ''} ${header.isPlaceholder ? '' : 'top-0 z-10'}`}
                    >
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
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      className={`${index === 0 ? 'sticky left-0 bg-white p-1' : 'p-1'}`}
                      key={cell.id}
                    >
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


function useSkipper() {
  const shouldSkipRef = React.useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  React.useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}