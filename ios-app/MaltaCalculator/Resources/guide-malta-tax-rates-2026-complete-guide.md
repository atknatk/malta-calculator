# Malta Tax Rates 2026 — Complete Guide

Malta uses **progressive income tax brackets** that depend on your tax status. This guide lays out all three 2026 tables used by Malta Calculator.

## Single rates

Zero tax on the first €9,100. The top bracket (35%) kicks in above €60,000.

| Taxable income  | Rate | Subtract |
| --------------- | ---- | -------- |
| 0 – 9,100       | 0%   | 0        |
| 9,101 – 14,500  | 15%  | 1,365    |
| 14,501 – 19,500 | 25%  | 2,815    |
| 19,501 – 60,000 | 25%  | 2,725    |
| 60,001 +        | 35%  | 8,725    |

## Married rates

Joint computation — the spouse with the lower income is included in the same return.

| Taxable income  | Rate | Subtract |
| --------------- | ---- | -------- |
| 0 – 12,700      | 0%   | 0        |
| 12,701 – 21,200 | 15%  | 1,905    |
| 21,201 – 28,700 | 25%  | 4,025    |
| 28,701 – 60,000 | 25%  | 3,905    |
| 60,001 +        | 35%  | 9,905    |

## Parent rates

For lone parents with qualifying children.

| Taxable income  | Rate | Subtract |
| --------------- | ---- | -------- |
| 0 – 10,500      | 0%   | 0        |
| 10,501 – 15,800 | 15%  | 1,575    |
| 15,801 – 21,200 | 25%  | 3,155    |
| 21,201 – 60,000 | 25%  | 3,050    |
| 60,001 +        | 35%  | 9,050    |

## How the `subtract` column works

The Malta tax formula is:

```
tax = income × rate − subtract
```

This flattens the cumulative bracket calculation into a single-step lookup once you know which row applies.

## Which rate should I use?

- Unmarried → **Single**
- Married, joint return → **Married**
- Single with children → **Parent**

When in doubt, the Malta Calculator salary screen will apply the correct table based on your category selection.
