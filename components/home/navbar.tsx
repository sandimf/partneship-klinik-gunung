'use client';
import * as React from 'react';
import { useEffect, useState, useRef, useId } from 'react';
import Image from 'next/image';
import {
    SunIcon,
    MoonIcon,
    ChevronDownIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes'

const Logo = (props: React.SVGAttributes<SVGElement>) => {
    return (
        <svg width='1em' height='1em' viewBox='0 0 324 323' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
            <rect
                x='88.1023'
                y='144.792'
                width='151.802'
                height='36.5788'
                rx='18.2894'
                transform='rotate(-38.5799 88.1023 144.792)'
                fill='currentColor'
            />
            <rect
                x='85.3459'
                y='244.537'
                width='151.802'
                height='36.5788'
                rx='18.2894'
                transform='rotate(-38.5799 85.3459 244.537)'
                fill='currentColor'
            />
        </svg>
    );
};

const LogoPNG = () => (
    <Image
        src="/logo.png"
        alt="Klinik Gunung Semeru"
        width={90}
        height={90}
    />
);

export const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const currentTheme = resolvedTheme || theme

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8"
        >
            {currentTheme === 'dark' ? (
                <MoonIcon className="h-4 w-4" />
            ) : (
                <SunIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

// User Menu Component
const UserMenu = ({
    userName = 'John Doe',
    userEmail = 'john@example.com',
    userAvatar,
    onItemClick
}: {
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    onItemClick?: (item: string) => void;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 py-0 hover:bg-accent hover:text-accent-foreground">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="text-xs">
                        {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                <ChevronDownIcon className="h-3 w-3 ml-1" />
                <span className="sr-only">User menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onItemClick?.('profile')}>
                Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onItemClick?.('settings')}>
                Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onItemClick?.('billing')}>
                Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onItemClick?.('logout')}>
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);
// Types
export interface NavbarNavItem {
    href?: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
    active?: boolean;
}
export interface NavbarLanguage {
    value: string;
    label: string;
}
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    logo?: React.ReactNode;
    logoHref?: string;
    navigationLinks?: NavbarNavItem[];
    languages?: NavbarLanguage[];
    defaultLanguage?: string;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
    onNavItemClick?: (href: string) => void;
    onLanguageChange?: (language: string) => void;
    onThemeChange?: (theme: 'light' | 'dark') => void;
    onUserItemClick?: (item: string) => void;
}
// Default navigation links with icons

// Default language options
const defaultLanguages: NavbarLanguage[] = [
    { value: 'en', label: 'En' },
    { value: 'es', label: 'Es' },
    { value: 'fr', label: 'Fr' },
    { value: 'de', label: 'De' },
    { value: 'ja', label: 'Ja' },
];
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
    (
        {
            className,
            logo = <Logo />,
            logoHref = '#',
            languages = defaultLanguages,
            defaultLanguage = 'en',
            userName = 'John Doe',
            userEmail = 'john@example.com',
            userAvatar,
            onNavItemClick,
            onLanguageChange,
            onThemeChange,
            onUserItemClick,
            ...props
        },
        ref
    ) => {
        const [isMobile, setIsMobile] = useState(false);
        const containerRef = useRef<HTMLElement>(null);
        const selectId = useId();
        useEffect(() => {
            const checkWidth = () => {
                if (containerRef.current) {
                    const width = containerRef.current.offsetWidth;
                    setIsMobile(width < 768); // 768px is md breakpoint
                }
            };
            checkWidth();
            const resizeObserver = new ResizeObserver(checkWidth);
            if (containerRef.current) {
                resizeObserver.observe(containerRef.current);
            }
            return () => {
                resizeObserver.disconnect();
            };
        }, []);
        // Combine refs
        const combinedRef = React.useCallback((node: HTMLElement | null) => {
            containerRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        }, [ref]);
        return (
            <header
                ref={combinedRef}
                className={cn(
                    'relative z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline',
                    className
                )}
                {...props}
            >
                <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
                    {/* Left side */}
                    <div className="flex flex-1 items-center gap-2">
                        {/* Mobile menu trigger */}

                        <div className="flex items-center gap-6">
                            {/* Logo */}
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
                            >
                                <div className="text-5xl">
                                    <LogoPNG />
                                </div>

                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>
            </header>
        );
    }
);
Navbar.displayName = 'Navbar';
export { Logo };