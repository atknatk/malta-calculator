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
import { Month, MonthlySalaryOutput } from "@/types/salary-calculator-type"
import { formatMoney } from "@/utils/money-format"
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    onBonusChange?: (month: Month, value: number) => void
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
    // String değeri number'a çevir ve NaN kontrolü yap
    const numericValue = parseFloat(value as string);
    const finalValue = isNaN(numericValue) ? 0 : numericValue;
    table.options.meta?.updateData(index, id, finalValue)
  }
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      onBlur();
    }
  };
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  return (
    <Input
      value={value as string}
      className="w-[5rem] h-8 py-0 px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      type="number"
      step={50}
      aria-label={`Gross Wage input`}
      onFocus={e => { e.target.select() }}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyUp={handleKeyPress}
      onWheel={e => e.currentTarget.blur()}
    />
  )
};

// Special Editable Cell for Bonus that triggers onBonusChange callback
const BonusEditableCell = ({
  getValue,
  row,
  table,
}: {
  getValue: any;
  row: { index: number; original: MonthlySalaryOutput };
  table: any;
}) => {
  const initialValue = getValue();
  const [value, setValue] = React.useState(initialValue)

  const onBlur = () => {
    const numericValue = parseFloat(value as string);
    const finalValue = isNaN(numericValue) ? 0 : numericValue;
    // Trigger the callback to update URL state
    table.options.meta?.onBonusChange?.(row.original.month, finalValue);
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      onBlur();
    }
  };

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Input
      value={value as string}
      className="w-[5rem] h-8 py-0 px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      type="number"
      step={100}
      aria-label={`Bonus input for ${row.original.month}`}
      onFocus={e => { e.target.select() }}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyUp={handleKeyPress}
      onWheel={e => e.currentTarget.blur()}
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
  // {
  //   accessorKey: "basicSalary",
  //   header: "Basic Salary",
  //   cell: ({ row }) => <div className="font-bold">{formatMoney(row.getValue("basicSalary"))}</div>,
  // },
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
    cell: BonusEditableCell,
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
    accessorKey: "cumulativeIncomeBase",
    header: "Cumulative Income Base",
    cell: ({ row }) => <div>{formatMoney(row.getValue("cumulativeIncomeBase"))}</div>,
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

export function SalaryTable({ data, setData, onBonusChange }:
  {
    data: MonthlySalaryOutput[],
    setData: React.Dispatch<React.SetStateAction<MonthlySalaryOutput[]>>,
    onBonusChange?: (month: Month, value: number) => void
  }
) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  // Default column visibility settings
  const defaultColumnVisibility: VisibilityState = {
    // Hide less important columns by default
    sscBase: false,
    incomeBase: false,
    cumulativeIncomeBase: false,
    nonTaxBenefit: false,
    taxBenefit: false,
    // bonus is now visible by default for editing per-month bonuses
    governmentBonus: false,
    discr: false,
  };

  // localStorage key for column visibility
  const STORAGE_KEY = 'salary-table-column-visibility';

  // Initialize column visibility from localStorage or use defaults
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    // Only run on client side
    if (typeof window === 'undefined') return defaultColumnVisibility;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as VisibilityState;
        // Merge with defaults to handle new columns
        return { ...defaultColumnVisibility, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load column visibility from localStorage:', e);
    }
    return defaultColumnVisibility;
  });

  // Save column visibility to localStorage when it changes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columnVisibility));
    } catch (e) {
      console.warn('Failed to save column visibility to localStorage:', e);
    }
  }, [columnVisibility]);
  const [rowSelection, setRowSelection] = React.useState({})
  const handleInputChange = React.useCallback((index: number, key: keyof MonthlySalaryOutput, value: string) => {
    setData((prevData) => {
      const updatedData = [...prevData] as any;
      updatedData[index][key] = value;
      return updatedData;
    });
  }, [setData]);

  const columns = React.useMemo(() => getColumns(handleInputChange), [handleInputChange]);
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
      onBonusChange,
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
          <caption className="sr-only">Monthly salary breakdown showing gross wage, taxes, social security contributions, and net pay for each month</caption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`${index === 0 ? 'sticky left-0 bg-background z-10' : ''} ${header.isPlaceholder ? '' : 'top-0 z-10'}`}
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
                      className={`${index === 0 ? 'sticky left-0 bg-background p-1' : 'p-1'}`}
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