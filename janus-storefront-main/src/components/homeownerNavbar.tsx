"use client";

import { ArrowRight } from "@/components/icons/arrowRight";
import { CarrotLeftIcon } from "@/components/icons/carrotLeftIcon";
import { CarrotRightIcon } from "@/components/icons/carrotRightIcon";
import { CloseIcon } from "@/components/icons/closeIcon";
import { SearchIcon } from "@/components/icons/searchIcon";
import {
  NavigationMenuAnchorItem,
  NavigationMenuContent,
  NavigationMenuExit,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigationMenu";
import { clickLocationEventListener } from "@/lib/analytics";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { useTranslations } from "next-intl";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type NavigationProperties = {
  urlBase: string;
};

type MenuObject = {
  [key: string]: string | MenuObject;
};

const HomeownerProductsMenu = {
  homeownerProducts: "/homeowner/products.html",
  paintSprayers: "/homeowner/products/paint-sprayers.html",
  handheldHouseholdRange:
    "/homeowner/products/paint-sprayers/handheld-household-range.html",
  householdRangeForFlatsHousesBiggerProjects:
    "/homeowner/products/paint-sprayers/household-range-for-apartments-houses-and-larger-projects.html",
  proSeriesForLargerJobSites:
    "/homeowner/products/paint-sprayers/pro-series-for-larger-job-sites.html",
  paintSprayerAccessories: {
    paintSprayerAccessories:
      "/homeowner/products/paint-sprayer-accessories.html",
    sprayTipsTipGuards:
      "/homeowner/products/paint-sprayer-accessories/spray-tips-tip-guards.html",
    sprayGuns: "/homeowner/products/paint-sprayer-accessories/guns.html",
    rollerSystemsCovers:
      "/homeowner/products/paint-sprayer-accessories/roller-systems-covers.html",
    filtersStainers:
      "/homeowner/products/paint-sprayer-accessories/filters-strainers.html",
  },
};

const HomeownerProjectsMenu = {
  homeProjects: "/homeowner/home-projects.html",
  decks:
    "/homeowner/home-projects/how-to-paint-or-stain-a-deck-using-a-paint-sprayer.html",
  fences:
    "/homeowner/home-projects/how-to-paint-or-stain-a-fence-using-an-airless-sprayer.html",
  ceilings:
    "/homeowner/home-projects/how-to-paint-a-popcorn-ceiling-using-an-airless-sprayer.html",
  interiorWalls:
    "/homeowner/home-projects/how-to-paint-a-room-quickly-and-easily-using-a-paint-sprayer.html",
  exteriorWalls:
    "/homeowner/home-projects/how-to-paint-the-exterior-of-a-house-using-an-airless-sprayer.html",
  doorsTrim:
    "/homeowner/home-projects/articles/how-to-paint-doors-and-trim-using-an-airless-sprayer.html",
  railings:
    "/homeowner/home-projects/how-to-paint-or-stain-railings-using-an-airless-sprayer.html",
  shutters:
    "/homeowner/home-projects/how-to-paint-shutters-using-an-airless-sprayer.html",
  outdoorFurniture:
    "/homeowner/home-projects/articles/how-to-paint-outdoor-furniture-using-an-airless-sprayer.html",
  homeFurniture:
    "/homeowner/home-projects/articles/how-to-paint-or-stain-home-furniture-using-an-airless-sprayer.html",
  sheds:
    "/homeowner/home-projects/articles/how-to-paint-a-shed-using-a-paint-sprayer.html",
  garageDoors:
    "/homeowner/home-projects/articles/how-to-paint-a-garage-door-using-a-paint-sprayer.html",
  cabinets:
    "/homeowner/home-projects/articles/how-to-paint-cabinets-with-an-airless-paint-sprayer.html",
};

const HomeownerHowToBuyMenu = {
  howToBuy: "/homeowner/how-to-buy.html",
  findRetailer: "/homeowner/how-to-buy/find-a-retailer.html",
  buyOnline: "/homeowner/how-to-buy/buy-online.html",
  sprayTipSelector: "/homeowner/how-to-buy/tipselector.html",
  talkWithAnExpert: "/homeowner/how-to-buy/talk-with-an-expert.html",
};

const HomeownerOwnerSupportMenu = {
  ownerSupport: "/homeowner/support.html",
  educationCenter: "/homeowner/support/education-center.html",
  ArticlesAdvice: "/homeowner/support/articles-advice.html",
  frequentlyAskedQuestions: "/homeowner/support/faq.html",
  productRegistration: "/homeowner/support/product-registration.html",
  magnumNewsletter: "/homeowner/support/magnum-newsletter.html",
  findManuals: "/homeowner/support/parts-search.html",
  certificationsAgencyApprovals:
    "/homeowner/support/certifications-agency-approvals.html",
  safetyDataSheets: "/homeowner/support/safety-data-sheets.html",
  findALocalRetailer: "/homeowner/support/find-service.html",
  contactUs: "/homeowner/support/contact-us.html",
  warranty: "/homeowner/support/warranty.html",
};

function NavigationLink(
  links: MenuObject,
  urlBase: string,
  navigationHeightStyle: object,
) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    const element = event.target as HTMLAnchorElement;
    clickLocationEventListener.apply(element);
  }

  const t = useTranslations("Navigation");
  return Object.entries(links).map(([key, value], index) => {
    if (typeof value === "string") {
      return (
        <React.Fragment key={index}>
          <span className="lg:px-2 lg:py-1">
            <NavigationMenuAnchorItem
              href={`${urlBase}${value}`}
              onClick={handleClick}
              className={`${index == 0 ? "font-bold" : "lg:text-sm"} text-neutral-black hover:text-secondary-cyan flex items-center justify-between text-base`}
            >
              {t(key)}
              {index == 0 && (
                <ArrowRight
                  className="fill-current"
                  aria-label="Continue"
                  role="presentation"
                />
              )}
            </NavigationMenuAnchorItem>
          </span>
          {index == 0 ? <hr className="lg:my-2" /> : ""}
        </React.Fragment>
      );
    } else {
      return (
        <NavigationMenuPrimitive.Item key={index}>
          <div className="font-roboto-condensed text-neutral-black items-center border-b-2 border-transparent text-base font-bold lg:text-sm lg:font-medium">
            <NavigationMenuTrigger
              className={
                "aria-expanded:text-tertiary-dark-cyan aria-expanded:bg-neutral-black-3 hover:text-secondary-cyan text-base aria-expanded:font-bold lg:rounded-sm lg:p-2 lg:text-sm"
              }
            >
              {t(key)}
              <CarrotRightIcon />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div
                style={navigationHeightStyle}
                className="fixed top-0 left-0 m-0 w-screen overflow-auto border-0 bg-white px-5 lg:absolute lg:top-0 lg:left-full lg:-mt-4.5 lg:ml-2 lg:flex lg:max-h-[80vh] lg:min-h-[80vh] lg:w-75 lg:border-2 lg:px-1 lg:py-5"
              >
                <div className="flex w-full justify-between gap-3 border-b-1 py-5 lg:hidden">
                  <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                    <NavigationMenuTrigger>
                      <CarrotLeftIcon className="inline-block aspect-square h-9 w-9" />
                    </NavigationMenuTrigger>
                  </div>
                  <p className="font-roboto justify flex items-center text-base font-bold">
                    {t(key)}
                  </p>
                  <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                    <NavigationMenuExit>
                      <CloseIcon
                        className="inline-block aspect-square h-4 w-4"
                        role="presentation"
                      />
                    </NavigationMenuExit>
                  </div>
                </div>
                <NavigationMenuPrimitive.NavigationMenu className="grow">
                  <NavigationMenuList className="flex-col py-5 lg:gap-1 lg:p-0 lg:px-1">
                    {NavigationLink(value, urlBase, navigationHeightStyle)}
                  </NavigationMenuList>
                </NavigationMenuPrimitive.NavigationMenu>
              </div>
            </NavigationMenuContent>
          </div>
        </NavigationMenuPrimitive.Item>
      );
    }
  });
}

export function HomeownerNavbar({ urlBase }: Readonly<NavigationProperties>) {
  const isMediumUp = window.innerWidth >= 768;
  const offset = 32;
  const triggerRef = useRef<HTMLDivElement>(null);
  const [navigationHeightStyle, setNavigationHeightStyle] = useState({});
  const t = useTranslations("Navigation");
  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (isMediumUp) {
        setNavigationHeightStyle({
          maxHeight: `calc(100vh - ${rect.bottom + offset}px)`,
          minHeight: `calc(100vh - ${rect.bottom + offset}px)`,
        });
      }
    }
  }, []);

  return (
    <div className="absolute top-0 left-0 z-10 min-h-[101vh] w-full bg-white px-5 lg:relative lg:h-auto lg:min-h-auto lg:w-auto lg:px-0">
      <section className="font-roboto-condensed container mx-auto flex w-full flex-row items-center justify-center gap-4 py-5 font-bold lg:hidden lg:gap-25 lg:py-3">
        <Form
          action={`${urlBase}/homeowner/search.html`}
          className="relative flex w-full"
        >
          <label htmlFor="site-search-label-mobile" className="sr-only">
            {t("searchPlaceholder")}
          </label>
          <input
            type="search"
            id="site-search-field-mobile"
            name="q"
            className="peer border-neutral-black-10 text-neutral-black-60 text-md focus:border-secondary-cyan font-roboto w-full rounded border-1 py-1 pr-4 pl-8 text-sm font-normal focus:outline-0"
            placeholder={t("searchPlaceholder")}
            autoFocus
          />
          <SearchIcon className="peer-focus:fill-secondary-cyan peer-active:fill-secondary-cyan absolute top-1/2 left-2 -translate-y-1/2 transform" />
        </Form>
        <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
          <NavigationMenuExit>
            <CloseIcon
              className="inline-block aspect-square h-4 w-4"
              role="presentation"
            />
          </NavigationMenuExit>
        </div>
      </section>
      <hr className="lg:mx-14 lg:hidden lg:py-4" />
      <div ref={triggerRef}>
        <NavigationMenuPrimitive.NavigationMenu>
          <NavigationMenuList className="w-full flex-col gap-5 bg-white py-5 lg:w-auto lg:flex-row lg:gap-6 lg:p-0">
            <NavigationMenuPrimitive.Item>
              <NavigationMenuTrigger className="font-roboto-condensed hover:border-secondary-cyan data-[state=open]:border-secondary-cyan text-neutral-black items-center border-b-2 border-transparent text-2xl font-bold tracking-normal lg:text-base lg:tracking-normal">
                {t("products")}
                <CarrotRightIcon className="lg:hidden" role="presentation" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  className={`lg:shadow-[0 4px 1pc 0 rgba(0, 0, 0, .15)] fixed top-0 left-0 z-50 m-0 mt-2 min-h-screen w-screen border-0 bg-white px-5 lg:absolute lg:inset-x-auto lg:top-10.5 lg:w-75 lg:border-2 lg:p-4 lg:px-1`}
                  style={navigationHeightStyle}
                >
                  <div className="font-roboto-condensed container mx-auto flex w-full flex-row items-center justify-between gap-4 overflow-auto border-b-1 py-5 font-bold lg:hidden lg:gap-25 lg:py-3">
                    <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                      <NavigationMenuTrigger>
                        <Image
                          src="/arrow-left.svg"
                          alt="Back Arrow"
                          width={32}
                          height={32}
                          className="inline-block"
                        />
                      </NavigationMenuTrigger>
                    </div>
                    <p className="font-roboto justify flex items-center text-base font-bold">
                      {t("products")}
                    </p>
                    <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                      <NavigationMenuExit>
                        <CloseIcon
                          className="inline-block aspect-square h-4 w-4"
                          role="presentation"
                        />
                      </NavigationMenuExit>
                    </div>
                  </div>
                  <NavigationMenuPrimitive.NavigationMenu className="h-full bg-white">
                    <NavigationMenuList className="flex-col gap-4 py-5 lg:gap-1 lg:p-0 lg:px-1">
                      {NavigationLink(
                        HomeownerProductsMenu,
                        urlBase,
                        navigationHeightStyle,
                      )}
                    </NavigationMenuList>
                  </NavigationMenuPrimitive.NavigationMenu>
                </div>
              </NavigationMenuContent>
            </NavigationMenuPrimitive.Item>
            <NavigationMenuPrimitive.Item>
              <NavigationMenuTrigger className="font-roboto-condensed hover:border-secondary-cyan data-[state=open]:border-secondary-cyan text-neutral-black items-center border-b-2 border-transparent text-2xl font-bold tracking-normal lg:text-base lg:tracking-normal">
                {t("projects")}
                <CarrotRightIcon className="lg:hidden" role="presentation" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  style={navigationHeightStyle}
                  className="lg:shadow-[0 4px 1pc 0 rgba(0, 0, 0, .15)] fixed top-0 left-0 z-50 m-0 mt-2 min-h-screen w-screen overflow-auto border-0 bg-white px-5 lg:absolute lg:inset-x-auto lg:top-10.5 lg:max-h-[80vh] lg:min-h-[80vh] lg:w-75 lg:border-2 lg:p-4 lg:px-1"
                >
                  <div className="flex w-full justify-between gap-3 border-b-1 py-5 lg:hidden">
                    <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                      <NavigationMenuTrigger>
                        <Image
                          src="/arrow-left.svg"
                          alt="Back Arrow"
                          width={32}
                          height={32}
                          className="inline-block"
                        />
                      </NavigationMenuTrigger>
                    </div>
                    <p className="font-roboto justify flex items-center text-base font-bold">
                      {t("projects")}
                    </p>
                    <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                      <NavigationMenuExit>
                        <CloseIcon
                          className="inline-block aspect-square h-4 w-4"
                          role="presentation"
                        />
                      </NavigationMenuExit>
                    </div>
                  </div>
                  <NavigationMenuPrimitive.NavigationMenu className="h-full bg-white">
                    <NavigationMenuList className="flex-col gap-4 py-5 lg:gap-1 lg:p-0 lg:px-1">
                      {NavigationLink(
                        HomeownerProjectsMenu,
                        urlBase,
                        navigationHeightStyle,
                      )}
                    </NavigationMenuList>
                  </NavigationMenuPrimitive.NavigationMenu>
                </div>
              </NavigationMenuContent>
            </NavigationMenuPrimitive.Item>
            <NavigationMenuPrimitive.Item>
              <NavigationMenuTrigger className="font-roboto-condensed hover:border-secondary-cyan data-[state=open]:border-secondary-cyan text-neutral-black items-center border-b-2 border-transparent text-2xl font-bold tracking-normal lg:text-base lg:tracking-normal">
                {t("howToBuy")}
                <CarrotRightIcon className="lg:hidden" role="presentation" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  style={navigationHeightStyle}
                  className="lg:shadow-[0 4px 1pc 0 rgba(0, 0, 0, .15)] fixed top-0 left-0 z-50 m-0 mt-2 min-h-screen w-screen overflow-auto border-0 bg-white px-5 lg:absolute lg:inset-x-auto lg:top-10.5 lg:max-h-[80vh] lg:min-h-[80vh] lg:w-75 lg:border-2 lg:p-4 lg:px-1"
                >
                  <div className="font-roboto-condensed container mx-auto flex w-full flex-row items-center justify-between gap-4 border-b-1 py-5 font-bold lg:hidden lg:gap-25 lg:py-3">
                    <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                      <NavigationMenuTrigger>
                        <Image
                          src="/arrow-left.svg"
                          alt="Back Arrow"
                          width={32}
                          height={32}
                          className="inline-block"
                        />
                      </NavigationMenuTrigger>
                    </div>
                    <p className="font-roboto justify flex items-center text-base font-bold">
                      {t("howToBuy")}
                    </p>
                    <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                      <NavigationMenuExit>
                        <CloseIcon
                          className="inline-block aspect-square h-4 w-4"
                          role="presentation"
                        />
                      </NavigationMenuExit>
                    </div>
                  </div>
                  <NavigationMenuPrimitive.NavigationMenu className="h-full bg-white">
                    <NavigationMenuList className="flex-col gap-4 py-5 lg:gap-1 lg:p-0 lg:px-1">
                      {NavigationLink(
                        HomeownerHowToBuyMenu,
                        urlBase,
                        navigationHeightStyle,
                      )}
                    </NavigationMenuList>
                  </NavigationMenuPrimitive.NavigationMenu>
                </div>
              </NavigationMenuContent>
            </NavigationMenuPrimitive.Item>
            <NavigationMenuPrimitive.Item>
              <NavigationMenuTrigger className="font-roboto-condensed hover:border-secondary-cyan data-[state=open]:border-secondary-cyan text-neutral-black items-center border-b-2 border-transparent text-2xl font-bold tracking-normal lg:text-base lg:tracking-normal">
                {t("ownerSupport")}
                <CarrotRightIcon className="lg:hidden" role="presentation" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  style={navigationHeightStyle}
                  className="lg:shadow-[0 4px 1pc 0 rgba(0, 0, 0, .15)] fixed top-0 left-0 z-50 m-0 mt-2 min-h-screen w-screen overflow-auto border-0 bg-white px-5 lg:absolute lg:inset-x-auto lg:top-10.5 lg:max-h-[80vh] lg:min-h-[80vh] lg:w-75 lg:border-2 lg:p-4 lg:px-1"
                >
                  <div className="font-roboto-condensed container mx-auto flex w-full flex-row items-center justify-between gap-4 border-b-1 py-5 font-bold lg:hidden lg:gap-25 lg:py-3">
                    <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                      <NavigationMenuTrigger>
                        <Image
                          src="/arrow-left.svg"
                          alt="Back Arrow"
                          width={32}
                          height={32}
                          className="inline-block"
                        />
                      </NavigationMenuTrigger>
                    </div>
                    <p className="font-roboto justify flex items-center text-base font-bold">
                      {t("ownerSupport")}
                    </p>
                    <div className="flex aspect-square h-8 w-8 items-center rounded-full border-1 p-2">
                      <NavigationMenuExit>
                        <CloseIcon
                          className="inline-block aspect-square h-4 w-4"
                          role="presentation"
                        />
                      </NavigationMenuExit>
                    </div>
                  </div>
                  <NavigationMenuPrimitive.NavigationMenu className="h-full bg-white">
                    <NavigationMenuList className="flex-col gap-4 py-5 lg:gap-1 lg:p-0 lg:px-1">
                      {NavigationLink(
                        HomeownerOwnerSupportMenu,
                        urlBase,
                        navigationHeightStyle,
                      )}
                    </NavigationMenuList>
                  </NavigationMenuPrimitive.NavigationMenu>
                </div>
              </NavigationMenuContent>
            </NavigationMenuPrimitive.Item>
            <Link
              href={urlBase + "/support/contact-us.html"}
              className="flex border-t-1 pt-4 lg:hidden"
            >
              <span className="text-lg font-normal">{t("contactUs")}</span>
            </Link>
            <Link
              href="https://partnerportal.graco.com/login"
              className="flex lg:hidden"
            >
              <span className="text-lg font-normal">
                {t("distributorLogin")}
              </span>
            </Link>
            <Link
              href="/globalselector.html"
              className="flex border-t-1 pt-4 text-lg font-normal lg:hidden"
            >
              <Image
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
                className="mr-1 inline-block"
              />
              {t("region/language")}
            </Link>
          </NavigationMenuList>
        </NavigationMenuPrimitive.NavigationMenu>
      </div>
    </div>
  );
}
