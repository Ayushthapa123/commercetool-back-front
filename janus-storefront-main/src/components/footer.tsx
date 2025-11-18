import { ArrowRight } from "@/components/icons/arrowRight";
import { OnetrustButton } from "@/components/onetrustButton";
import { ScrollToTop } from "@/components/scrollToTop";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import baseUrl from "@/lib/i18n/navigation";
import Image from "next/image";
import Link from "next/link";

type FooterProps = {
  t: (key: string) => string;
};

type FooterLink = {
  href: string;
  translation: string;
};

export async function Footer({ t }: Readonly<FooterProps>) {
  const urlBase = await baseUrl();

  const howToBuyLinks: FooterLink[] = [
    {
      href: `${urlBase}/homeowner/how-to-buy/find-a-retailer.html`,
      translation: t("findRetailer"),
    },
    {
      href: `${urlBase}/homeowner/support/contact-us.html`,
      translation: t("contactUs"),
    },
  ];

  const ownerSupportLinks: FooterLink[] = [
    {
      href: `${urlBase}/homeowner/support/contact-us.html`,
      translation: t("contactTechnicalSupport"),
    },
    {
      href: `${urlBase}/homeowner/support/education-center.html`,
      translation: t("educationCenter"),
    },
    {
      href: `${urlBase}/homeowner/support/parts-search.html`,
      translation: t("findManuals"),
    },
  ];

  const productSolutionLinks: FooterLink[] = [
    { href: `${urlBase}/contractor.html`, translation: t("contractor") },
    {
      href: `${urlBase}/vehicle-service.html`,
      translation: t("serviceAndEquipment"),
    },
    {
      href: `${urlBase}/in-plant-manufacturing.html`,
      translation: t("industrialManufacturing"),
    },
    {
      href: "https://partnerportal.graco.com/login",
      translation: t("distributorLogin"),
    },
  ];

  const homeProjectLinks: FooterLink[] = [
    {
      href: `${urlBase}/homeowner/home-projects/articles/how-to-paint-or-stain-a-deck-using-a-paint-sprayer.html`,
      translation: t("decks"),
    },
    {
      href: `${urlBase}/homeowner/home-projects/articles/how-to-paint-a-room-quickly-and-easily-using-a-paint-sprayer.html`,
      translation: t("interiorWalls"),
    },
    {
      href: `${urlBase}/homeowner/home-projects/articles/how-to-paint-or-stain-a-fence-using-an-airless-sprayer.html`,
      translation: t("fences"),
    },
    {
      href: `${urlBase}/homeowner/home-projects.html`,
      translation: t("allProjects"),
    },
  ];

  const footerNav = new Map<string, FooterLink[]>([
    [t("howToBuy"), howToBuyLinks],
    [t("ownerSupport"), ownerSupportLinks],
    [t("productsAndSolutions"), productSolutionLinks],
    [t("homeProjects"), homeProjectLinks],
  ]);

  const navLinks = (links: FooterLink[]) =>
    links.map((link, index) => {
      return (
        <li key={index}>
          <Link
            href={link.href}
            className="hover:text-secondary-cyan hover:underline"
          >
            {link.translation}
          </Link>
        </li>
      );
    });

  return (
    <footer className="mx-0 ml-[calc(-50vw+50%)] flex flex-col">
      <div className="container mx-auto flex grow gap-3 px-5 py-6 md:px-0">
        <Image
          src="/graco-logo-horizontal-tagline.svg"
          alt="Graco logo horizontal tagline"
          width={180}
          height={38}
          priority
        />
        <div className="ml-auto flex items-center">
          <Link href="/globalselector.html" className="mr-6 hidden md:inline">
            <Image
              src="/globe.svg"
              alt="Language Selector Globe"
              width={16}
              height={16}
              className="mr-1 mb-1 inline-block"
            />
            <span className="font-bold">{t("region/language")}</span>
          </Link>
          <ScrollToTop />
        </div>
      </div>
      <div className="bg-neutral-black w-screen text-white">
        <div className="container mx-auto py-0 md:py-14">
          <div className="hidden gap-3 md:flex">
           ..
          </div>
          <div className="flex md:hidden">
            <Accordion type="multiple" className="grow">
            
            </Accordion>
          </div>
        </div>
        <div className="container mx-auto flex grow flex-col-reverse gap-6 px-5 py-6 md:px-0 lg:flex-row">
          <div className="flex grow flex-col-reverse gap-2 lg:flex-row">
            <div>
              <p className="mt-3 text-xs font-bold">
                © Graco Inc. {t("allRightsReserved")}
              </p>
            </div>
            <div>
              <ul className="flex flex-wrap gap-6 px-0 py-4 leading-4 lg:flex-nowrap lg:p-4">
                <li className="grow basis-[40%] pl-2 lg:basis-auto">
                  <Link
                    id="privacyPolicy"
                    className="text-xs hover:underline"
                    href={`${urlBase}/privacy-policy.html`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("privacyNotice")}
                  </Link>
                </li>
                <li className="grow basis-[40%] pl-2 lg:basis-auto">
                  <Link
                    id="termsOfService"
                    className="text-xs hover:underline"
                    href={`${urlBase}/terms-of-service.html`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("termsOfService")}
                  </Link>
                </li>
                <li className="grow basis-[40%] pl-2 lg:basis-auto">
                  <Link
                    id="trademarks"
                    className="text-xs hover:underline"
                    href={`${urlBase}/trademarks.html`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("trademarks")}
                  </Link>
                </li>
                <li className="grow basis-[40%] pl-2 lg:basis-auto">
                  <Link
                    id="patents"
                    className="text-xs hover:underline"
                    href={`${urlBase}/patents.html`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("patents")}
                  </Link>
                </li>
                <li className="grow basis-[40%] pl-2 lg:basis-auto">
                  <OnetrustButton
                    privacyPreferencesText={t("privacyPreferences")}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="flex">
            <div className="flex shrink grow basis-0 items-center gap-6 text-sm">
              <a href="https://www.youtube.com/channel/UCTkieNEo8LSHL79lDAllYRA">
                <Image
                  src="/youtube.svg"
                  alt="Youtube"
                  width={24}
                  height={24}
                />
              </a>
              <a href="https://www.linkedin.com/company/graco">
                <Image
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                />
              </a>
              <a href="https://www.facebook.com/MagnumByGraco">
                <Image
                  src="/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </a>
              <Link
                href={`${urlBase}/homeowner/social-media.html`}
                className="flex flex-row items-center gap-2 font-bold"
              >
                {t("moreSocial")}
                <ArrowRight className="fill-current" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
