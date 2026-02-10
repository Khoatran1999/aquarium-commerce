import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { cn } from '../utils/cn';
export function Tabs({ items, defaultValue, value, onChange, className }) {
    const [internal, setInternal] = useState(defaultValue ?? items[0]?.value ?? '');
    const active = value ?? internal;
    const handleChange = (val) => {
        if (!value)
            setInternal(val);
        onChange?.(val);
    };
    return (_jsxs("div", { className: cn('flex flex-col', className), children: [_jsx("div", { role: "tablist", className: "border-border flex gap-1 border-b", children: items.map((tab) => (_jsx("button", { role: "tab", "aria-selected": active === tab.value, disabled: tab.disabled, onClick: () => handleChange(tab.value), className: cn('-mb-px px-4 py-2.5 text-sm font-medium transition-colors', 'hover:text-foreground focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-2', 'disabled:pointer-events-none disabled:opacity-50', active === tab.value
                        ? 'border-primary text-primary border-b-2'
                        : 'text-muted-foreground'), children: tab.label }, tab.value))) }), items.map((tab) => (_jsx("div", { role: "tabpanel", hidden: active !== tab.value, className: "pt-4", children: active === tab.value && tab.content }, tab.value)))] }));
}
