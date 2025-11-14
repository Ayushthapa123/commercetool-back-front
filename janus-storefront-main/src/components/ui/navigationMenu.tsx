"use client";

import { CarrotRightIcon } from "@/components/icons/carrotRightIcon";
import { cn } from "@/lib/utils";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const containerContext = createContext({
  isContainerOpen: {} as boolean,
  setIsContainerOpen: {} as Dispatch<SetStateAction<boolean>>,
});

export function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <NavigationMenuPrimitive.NavigationMenu
      data-slot="navigation-menu"
      defaultValue={isMobile ? "" : "container"}
      value={isMobile ? undefined : "container"}
      className={cn(className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.NavigationMenu>
  );
}

export function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        "font-roboto flex w-full justify-between text-sm font-normal",
        className,
      )}
      onPointerLeave={(e) => e.preventDefault()}
      onPointerMove={(e) => e.preventDefault()}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  );
}

export function NavigationMenuAnchorItem({
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <NavigationMenuPrimitive.Item>
      <a
        className={cn(
          "font-roboto text-tertiary-dark-cyan text-sm font-normal",
          className,
        )}
        {...props}
      >
        {children}
      </a>
    </NavigationMenuPrimitive.Item>
  );
}

export function NavigationMenuList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn("flex gap-4", className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.List>
  );
}

export function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      onPointerLeave={(e) => e.preventDefault()}
      className={className}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Content>
  );
}

export function NavigationMenuSub({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Sub>) {
  return (
    <NavigationMenuPrimitive.Sub
      className={cn(
        "shadow-[0 4px 1pc 0 rgba(0, 0, 0, .15)] absolute z-50 min-h-[75vh] w-75 border-2 bg-white p-4",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Sub>
  );
}

type NavigationMenuSubProps = React.ComponentProps<
  typeof NavigationMenuPrimitive.Trigger
> & {
  triggerLabel?: string;
};

export function NavigationMenuSubMenu({
  className,
  children,
  triggerLabel,
  ...props
}: NavigationMenuSubProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NavigationMenuTrigger
        className={cn(
          "aria-expanded:text-secondary-cyan aria-expanded:font-bold",
          className,
        )}
        onClick={() => setIsOpen((prev: boolean) => !prev)}
        aria-expanded={isOpen}
        {...props}
      >
        {triggerLabel}
        <CarrotRightIcon />
      </NavigationMenuTrigger>
      {isOpen && children}
    </>
  );
}

export function NavigationMenuContainerItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const value = { isContainerOpen, setIsContainerOpen };

  return (
    <containerContext.Provider value={value}>
      <NavigationMenuPrimitive.Item
        data-slot="navigation-menu-item"
        className={cn("relative", className)}
        value={"container"}
        {...props}
      />
    </containerContext.Provider>
  );
}

export function NavigationMenuExit({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  const { isContainerOpen, setIsContainerOpen } = useContext(containerContext);

  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(className)}
      onClick={() => setIsContainerOpen(isContainerOpen)}
      {...props}
    />
  );
}
