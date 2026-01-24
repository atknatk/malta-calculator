"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./input";

export interface NumericInputProps extends Omit<InputProps, "value" | "onChange" | "type"> {
    /**
     * The numeric value. Can be number or empty string (for empty input)
     */
    value: number | "";
    /**
     * Callback when value changes. Receives number or empty string
     */
    onChange: (value: number | "") => void;
    /**
     * Minimum allowed value (default: no minimum)
     */
    min?: number;
    /**
     * Maximum allowed value (default: no maximum)
     */
    max?: number;
    /**
     * Allow decimal values (default: true)
     */
    allowDecimals?: boolean;
    /**
     * Step for increment/decrement (default: 1)
     */
    step?: number;
    /**
     * Suffix to show on the right side of input (e.g., "€", "€/hr")
     */
    suffix?: string;
    /**
     * Custom class for the suffix element
     */
    suffixClassName?: string;
}

/**
 * NumericInput - A controlled numeric input that properly handles empty values
 * 
 * Solves the "can't delete zero" problem by properly managing internal string state
 * while exposing a clean numeric API to consumers.
 */
const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
    (
        {
            className,
            value,
            onChange,
            min,
            max,
            allowDecimals = true,
            step = 1,
            suffix,
            suffixClassName,
            onFocus,
            ...props
        },
        ref
    ) => {
        // Internal string state for proper input handling
        const [internalValue, setInternalValue] = React.useState<string>(
            value === "" ? "" : String(value)
        );

        // Track if we're currently focused to prevent external sync during typing
        const isFocusedRef = React.useRef(false);

        // Sync internal state when external value changes (only when not focused)
        React.useEffect(() => {
            if (!isFocusedRef.current) {
                const newValue = value === "" ? "" : String(value);
                setInternalValue(newValue);
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            // Allow empty input
            if (inputValue === "") {
                setInternalValue("");
                onChange("");
                return;
            }

            // Allow single minus sign at start (for typing negative numbers)
            if (inputValue === "-") {
                setInternalValue("-");
                return;
            }

            // Allow decimal point input (for typing decimals like "5.")
            if (allowDecimals && (inputValue === "." || inputValue === "-." || inputValue.endsWith("."))) {
                // Check if valid partial number
                const testValue = inputValue.replace(/\.$/, "");
                if (testValue === "" || testValue === "-" || !isNaN(Number(testValue))) {
                    setInternalValue(inputValue);
                    // Also fire onChange with current valid number
                    if (testValue !== "" && testValue !== "-") {
                        const numValue = parseFloat(testValue);
                        if (!isNaN(numValue)) {
                            onChange(numValue);
                        }
                    }
                    return;
                }
            }

            // Parse and validate the number
            const numValue = allowDecimals ? parseFloat(inputValue) : parseInt(inputValue, 10);

            if (isNaN(numValue)) {
                return; // Reject non-numeric input
            }

            // Update internal state with what user typed
            setInternalValue(inputValue);

            // Fire onChange with the numeric value (no min/max constraints during typing)
            onChange(numValue);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            isFocusedRef.current = false;

            // On blur, clean up the display value and apply constraints
            if (internalValue === "" || internalValue === "-" || internalValue === ".") {
                // If empty or incomplete, keep empty
                setInternalValue("");
                onChange("");
            } else {
                // Parse the current value
                const numValue = allowDecimals ? parseFloat(internalValue) : parseInt(internalValue, 10);

                if (!isNaN(numValue)) {
                    // Apply min/max constraints on blur
                    let finalValue = numValue;
                    if (min !== undefined) {
                        finalValue = Math.max(min, finalValue);
                    }
                    if (max !== undefined) {
                        finalValue = Math.min(max, finalValue);
                    }

                    setInternalValue(String(finalValue));

                    // Only fire onChange if value changed due to constraints
                    if (finalValue !== numValue) {
                        onChange(finalValue);
                    }
                }
            }

            // Call original onBlur if provided
            props.onBlur?.(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            isFocusedRef.current = true;
            // Select all on focus for easy replacement
            e.target.select();
            onFocus?.(e);
        };

        const inputElement = (
            <Input
                {...props}
                ref={ref}
                type="text"
                inputMode={allowDecimals ? "decimal" : "numeric"}
                pattern={allowDecimals ? "[0-9]*\\.?[0-9]*" : "[0-9]*"}
                value={internalValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                className={cn(
                    // Base styles - always applied
                    "w-full rounded-xl bg-background border border-border",
                    "focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none",
                    "font-semibold transition-all duration-200",
                    // Hide browser number input spinners
                    "[appearance:textfield]",
                    "[&::-webkit-outer-spin-button]:appearance-none",
                    "[&::-webkit-inner-spin-button]:appearance-none",
                    // Add right padding for suffix
                    suffix && "pr-12",
                    // Custom classes from props (for height, text size, etc.)
                    className
                )}
            />
        );

        if (suffix) {
            return (
                <div className="relative w-full">
                    {inputElement}
                    <div
                        className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground/70 pointer-events-none",
                            suffixClassName
                        )}
                    >
                        {suffix}
                    </div>
                </div>
            );
        }

        return inputElement;
    }
);

NumericInput.displayName = "NumericInput";

export { NumericInput };
