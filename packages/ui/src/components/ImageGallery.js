import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { cn } from '../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export function ImageGallery({ images, className }) {
    const [activeIndex, setActiveIndex] = useState(0);
    if (images.length === 0) {
        return (_jsx("div", { className: cn('bg-muted flex aspect-square items-center justify-center rounded-xl', className), children: _jsx("span", { className: "text-muted-foreground text-sm", children: "No images" }) }));
    }
    const active = images[activeIndex];
    const hasPrev = activeIndex > 0;
    const hasNext = activeIndex < images.length - 1;
    return (_jsxs("div", { className: cn('flex flex-col gap-3', className), children: [_jsxs("div", { className: "bg-muted relative aspect-square overflow-hidden rounded-xl", children: [_jsx("img", { src: active.url, alt: active.alt ?? '', className: "h-full w-full object-cover transition-opacity duration-300" }), images.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => hasPrev && setActiveIndex(activeIndex - 1), disabled: !hasPrev, "aria-label": "Previous image", className: "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition-colors hover:bg-white disabled:opacity-30", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => hasNext && setActiveIndex(activeIndex + 1), disabled: !hasNext, "aria-label": "Next image", className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow transition-colors hover:bg-white disabled:opacity-30", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] }))] }), images.length > 1 && (_jsx("div", { className: "flex gap-2 overflow-x-auto", children: images.map((img, i) => (_jsx("button", { onClick: () => setActiveIndex(i), className: cn('h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors', i === activeIndex
                        ? 'border-primary'
                        : 'border-transparent opacity-60 hover:opacity-100'), children: _jsx("img", { src: img.url, alt: img.alt ?? '', className: "h-full w-full object-cover" }) }, i))) }))] }));
}
