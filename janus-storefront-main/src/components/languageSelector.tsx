import AdobeAnalyticsLink from "@/components/AdobeAnalyticsLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RegionLanguageSelectionEvent } from "@/lib/analytics";
import Image from "next/image";

type LanguageSelectorProperties = {
  pagePath: string;
  t: (key: string) => string;
};

type LanguageLink = {
  href: string;
  translation: string;
};

function languageLink(links: LanguageLink[], region: string) {
  return links.map((link, index) => {
    const event: RegionLanguageSelectionEvent = {
      event: "regionLanguageSelection",
      event_name: "regionLanguageSelection",
      regionSelected: region,
      languageSelected: link.translation.toLowerCase(),
    };

    return (
      <div
        key={index}
        className="text-secondary-cyan flex w-full px-1 pt-4 text-sm font-normal first:pt-0 hover:underline"
      >
        <AdobeAnalyticsLink href={link.href} key={index} analyticsData={event}>
          {link.translation}
        </AdobeAnalyticsLink>
      </div>
    );
  });
}

export default function LanguageSelector({
  pagePath,
  t,
}: Readonly<LanguageSelectorProperties>) {
  let path = pagePath;
  if (pagePath !== "" && !pagePath.endsWith(".html")) {
    // add .html suffix if not present
    path = `${pagePath}.html`;
  }
  const asiaPacific: LanguageLink[] = [
    { href: `/au/en/${path}`, translation: "English" },
    { href: `/cn/zh/${path}`, translation: "中文" },
    { href: `/jp/ja/${path}`, translation: "日本語" },
    { href: `/kr/ko/${path}`, translation: "한국어" },
  ];

  const emea: LanguageLink[] = [
    { href: `/gb/en/${path}`, translation: "English" },
    { href: `/be/nl/${path}`, translation: "Nederlands" },
    { href: `/de/de/${path}`, translation: "Deutsch" },
    { href: `/fr/fr/${path}`, translation: "Français" },
    { href: `/ru/ru/${path}`, translation: "Pусский" },
    { href: `/es/es/${path}`, translation: "Español" },
    { href: `/it/it/${path}`, translation: "Italiano" },
    { href: `/pl/pl/${path}`, translation: "Polski" },
    { href: `/se/sv/${path}`, translation: "Svenska" },
    { href: `/tr/tr/${path}`, translation: "Türkçe" },
    { href: `/cz/cs/${path}`, translation: "čeština" },
    { href: `/dk/da/${path}`, translation: "Dansk" },
    { href: `/sa/ar/${path}`, translation: "العربية" },
  ];

  const northAmerica: LanguageLink[] = [
    { href: `/us/en/${path}`, translation: "English" },
    { href: `/mx/es/${path}`, translation: "Español" },
    { href: `/ca/fr/${path}`, translation: "Français" },
  ];

  const southCentralAmerica: LanguageLink[] = [
    { href: `/br/pt/${path}`, translation: "Português" },
    { href: `/co/es/${path}`, translation: "Español" },
  ];

  const accordionTriggerClasses =
    "[&[data-state=open]]:bg-neutral-black-3 [&[data-state=open]]:text-neutral-black text-neutral-black-60 my-2 rounded-xs px-1 py-2 text-sm hover:no-underline [&[data-state=open]]:font-bold";

  const accordionItemClasses = "w-full border-t-1 border-b-0";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Image
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            className="mr-1 inline-block"
          />
          {t("region/language")}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        id="languageSelectorHeader"
        className="mt-3 max-h-[93vh] min-h-[93vh] w-auto overflow-auto rounded-none px-4"
      >
        <DropdownMenuLabel className="px-0 py-4 text-lg font-semibold">
          {t("selectRegion")}
        </DropdownMenuLabel>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className={accordionItemClasses}>
            <AccordionTrigger className={accordionTriggerClasses}>
              <span>{t("asiaPacific")}</span>
            </AccordionTrigger>
            <AccordionContent>
              {languageLink(asiaPacific, "Asia Pacific")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className={accordionItemClasses}>
            <AccordionTrigger className={accordionTriggerClasses}>
              {t("emea")}
            </AccordionTrigger>
            <AccordionContent>
              {languageLink(emea, "Europe, Middle East, and Africa")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className={accordionItemClasses}>
            <AccordionTrigger className={accordionTriggerClasses}>
              {t("northAmerica")}
            </AccordionTrigger>
            <AccordionContent>
              {languageLink(northAmerica, "North America")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className={accordionItemClasses}>
            <AccordionTrigger className={accordionTriggerClasses}>
              {t("southCentralAmerica")}
            </AccordionTrigger>
            <AccordionContent>
              {languageLink(southCentralAmerica, "South & Central America")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <DropdownMenuItem className="text-secondary-cyan border-t-1 px-2 py-4 text-sm font-semibold hover:underline focus:bg-white">
          <a href="/globalselector.html" className="text-secondary-cyan">
            {t("globalListing")}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
