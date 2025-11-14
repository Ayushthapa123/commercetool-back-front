"use client";

import { SearchIcon } from "@/components/icons/searchIcon";
import { NavigationMenuTrigger } from "@/components/ui/navigationMenu";
import { useTranslations } from "next-intl";
import Form from "next/form";
import { useRef, useState } from "react";

type SearchProperties = {
  urlBase: string;
};

export function Search({ urlBase }: Readonly<SearchProperties>) {
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations("Navigation");
  const formRef = useRef<HTMLFormElement>(null);

  function toggleSearch() {
    if (!searchOpen) {
      setSearchOpen(!searchOpen);
    } else {
      formRef.current?.requestSubmit();
    }
  }

  return (
    <search className="flex w-full items-center gap-2">
      <NavigationMenuTrigger>
        <SearchIcon
          id="search-icon-mobile"
          className="mr-1 inline-block h-6 w-6 lg:hidden"
          role="presentation"
        />
      </NavigationMenuTrigger>
      {searchOpen && (
        <Form
          action={`${urlBase}/homeowner/search.html`}
          className="relative ml-1 hidden lg:inline"
          id="search-form"
          ref={formRef}
        >
          <label htmlFor="site-search-label" className="sr-only text-xs">
            {t("searchPlaceholder")}
          </label>
          <input
            type="search"
            id="site-search-field"
            name="q"
            className="peer border-neutral-black-10 text-neutral-black-60 focus:border-secondary-cyan font-roboto h-9 w-53 rounded border-1 p-2 text-xs font-normal focus:outline-0"
            placeholder={t("searchPlaceholder")}
          />
        </Form>
      )}
      <div
        className="hover:text-secondary-cyan hidden h-4 items-center lg:flex"
        onClick={toggleSearch}
        id="search-button"
      >
        <SearchIcon
          id="search-icon"
          className="mr-1 inline-block h-4 w-4 fill-current"
          role="presentation"
          height={16}
          width={16}
        />
        {!searchOpen ? t("search") : ""}
      </div>
    </search>
  );
}
