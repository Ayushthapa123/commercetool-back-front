"use client";

import CartCountIcon from "@/components/cartCountIcon";
import { CurrencyDropdown } from "@/components/currencyDropdown";
import { HomeownerNavbar } from "@/components/homeownerNavbar";
import { CartIcon } from "@/components/icons/cartIcon";
import { HamburgerIcon } from "@/components/icons/hamburgerIcon";
import LanguageSelector from "@/components/languageSelector";
import { Search } from "@/components/search";
import {
  NavigationMenu,
  NavigationMenuContainerItem,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigationMenu";
import { eCommerceLocales } from "@/constants";
import { QuickOperationalVideoRefreshProvider } from "@/lib/context/quickOperationalVideosContext";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationProperties = {
  urlBase: string;
  locale: string;
};

export function Navigation({
  urlBase,
  locale,
}: Readonly<NavigationProperties>) {
  const t = useTranslations("Navigation");
  const pathname = usePathname().split("/");
  const path = pathname.slice(3).join("/");
  const isCheckoutPage = path.startsWith("checkout");

  if (isCheckoutPage) {
    return (
      <header className="my-3 flex grow flex-col gap-2 px-4 pt-4 lg:container lg:pt-11">
        <section>
          <div className="mx-auto flex items-center gap-6">
            <Image
              src="/graco-logo.svg"
              alt="Graco logo"
              width={180}
              height={38}
              priority
            />
          </div>
        </section>
      </header>
    );
  }

  return (
    <header className="w-full">
      <section
        id="utility-bar"
        className="bg-neutral-black-3 border-secondary-cyan hidden min-h-9 w-screen border-t-4 py-2 text-sm leading-tight lg:block"
      >
        <div className="container mx-auto flex flex-row">
          <nav className="mr-auto flex gap-6">
            <Link href={urlBase} className="hover:text-primary-blue">
              Graco Inc.
            </Link>
            <Link
              href={`${urlBase}/contractor.html`}
              className="hover:text-primary-blue"
            >
              For Contractors
            </Link>
            <Link
              href={`${urlBase}/vehicle-service.html`}
              className="hover:text-primary-blue"
            >
              For Vehicle Service & Heavy Equipment
            </Link>
            <Link
              href={`${urlBase}/in-plant-manufacturing.html`}
              className="hover:text-primary-blue"
            >
              For Industrial, Manufacturing & Processing
            </Link>
          </nav>
          <nav className="ml-auto flex gap-6">
            <Link
              href="https://partnerportal.graco.com/login"
              className="hover:text-primary-blue"
            >
              {t("forDistributors")}
            </Link>
            <LanguageSelector pagePath={path} t={t} />
          </nav>
        </div>
      </section>
      <QuickOperationalVideoRefreshProvider>
        <NavigationMenu>
          <NavigationMenuList className="w-full gap-0">
            <NavigationMenuContainerItem className="w-full">
              <section
                id="header-primary"
                className="font-roboto-condensed container mx-auto flex w-full flex-row items-center justify-center py-5 font-bold lg:gap-25 lg:py-3"
              >
                <div
                  id="cmp-navigation-mobile"
                  className="flex w-auto pr-4 pl-5 lg:hidden lg:pr-0 lg:pl-0"
                >
                  <NavigationMenuTrigger>
                    <HamburgerIcon className="mr-3 inline-block h-6 w-6" />
                  </NavigationMenuTrigger>
                </div>
                <Link
                  href={`${urlBase}/homeowner.html`}
                  className="mx-auto flex items-end gap-4 lg:mr-auto lg:ml-0 lg:items-center"
                >
                  <Image
                    src="/graco-logo.svg"
                    alt="Graco logo"
                    width={180}
                    height={38}
                    priority
                    className="h-6.25 w-auto"
                  />
                  <div className="hidden border-l pl-4 lg:block">
                    {t("homeowner")}
                  </div>
                </Link>
                <div className="flex w-auto items-center gap-4 lg:mr-0 lg:ml-auto lg:items-center lg:gap-6">
                  <Search urlBase={urlBase} />
                  <Link
                    className={cn(
                      "hover:text-secondary-cyan hidden border-neutral-200 lg:inline",
                      eCommerceLocales.includes(locale)
                        ? "lg:border-r lg:pr-6"
                        : "",
                    )}
                    href={`${urlBase}/support/contact-us.html`}
                  >
                    Contact
                  </Link>
                  {eCommerceLocales.includes(locale) && (
                    <>
                      <CurrencyDropdown />
                      <div className="inline-block w-full lg:block">
                        <Link href={urlBase + "/cart.html"}>
                          <div className="group relative cursor-pointer pr-5 lg:pr-0">
                            <CartIcon
                              className="group-hover:fill-secondary-cyan h-6 w-6"
                              aria-label="Cart Icon"
                              role="img"
                            />
                            <CartCountIcon />
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </section>
              <NavigationMenuContent className="z-20 bg-white" asChild={true}>
                <section
                  id="cmp-navigation"
                  className="font-roboto-condensed container mx-auto flex flex-row py-4 font-bold"
                >
                  <HomeownerNavbar urlBase={urlBase} />
                </section>
              </NavigationMenuContent>
            </NavigationMenuContainerItem>
          </NavigationMenuList>
        </NavigationMenu>
      </QuickOperationalVideoRefreshProvider>
      <hr className="" />
    </header>
  );
}
