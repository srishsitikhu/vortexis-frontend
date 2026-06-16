'use client';

import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface ReusableDropdownProps<T = string> {
    items: T[];
    disabled?: boolean;
    placeholder?: string;
    value?: T | null;
    onSelect: (item: T) => void;
}

export function ReusableDropdown<T extends string>({
    items,
    disabled = false,
    placeholder = 'Select',
    value = null,
    onSelect,
}: ReusableDropdownProps<T>) {
    const [selected, setSelected] = React.useState<T | null>(value);
    const [open, setOpen] = React.useState(false);

    // Sync external value changes
    React.useEffect(() => {
        setSelected(value ?? null);
    }, [value]);

    const handleSelect = (item: T) => {
        setSelected(item);
        onSelect(item);
        setOpen(false);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!disabled) {
            setOpen(isOpen);
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <div
                    className={`input-field flex cursor-pointer items-center justify-between ${open ? 'border-primary-500' : ''
                        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    <span className={!selected ? 'text-neutral-400' : ''}>{selected ?? placeholder}</span>
                    <ChevronDown
                        size={16}
                        className={`ml-2 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                    />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-neutral-100 shadow-neutral-400 z-40 w-[var(--radix-dropdown-menu-trigger-width)] rounded-md p-1 shadow-md">
                {items.map(item => (
                    <DropdownMenuItem
                        key={item}
                        onSelect={() => handleSelect(item)}
                        className="hover:bg-secondary-500 bg-neutral-100 cursor-pointer rounded-sm px-4 py-2 transition-colors duration-300 outline-none"
                    >
                        {item}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
