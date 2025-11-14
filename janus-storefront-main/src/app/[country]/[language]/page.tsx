import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "HomePage" });
  return (
    <>
      <h1 className="text-3xl">Landing Page?</h1>
      <div>{t("key")}</div>

      <Accordion type="multiple">
        <AccordionItem
          value="item-1"
          className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
        >
          <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 font-bold">
            Item 1
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed magna
            tempor quis lacinia nec, auctor vitae ex. Ut faucibus mattis
            ultricies. Mauris consectetur nulla quis massa vulputate, a pulvinar
            ex condimentum. In condimentum mattis justo, sed pellentesque arcu
            dapibus nec. Nulla facilisi. Aliquam laoreet urna ornare odio luctus
            efficitur. Duis sodales, velit in mollis blandit, mi arcu posuere
            erat, id venenatis lacus sem nec lacus. Aenean sit amet facilisis
            dolor. Morbi dictum mi nisi, sed varius nibh dictum ac. Nunc vitae
            efficitur turpis. Ut eu neque luctus, venenatis ex ut, ornare ante.
            Vivamus nunc erat, dictum in risus sit amet, hendrerit aliquet odio.
            Nam molestie eget lacus quis rhoncus. Ut iaculis ex at gravida
            vulputate. Morbi urna nunc, tristique in aliquam non, facilisis non
            arcu. In fringilla enim a aliquet aliquet. Pellentesque felis lorem,
            suscipit a velit id, aliquet tempor mauris. Suspendisse condimentum,
            turpis sit amet pellentesque accumsan, orci mauris lobortis justo,
            in aliquam eros risus in ex. Sed sollicitudin vestibulum quam, vitae
            rutrum sem faucibus eget. Duis mauris ligula, maximus at malesuada
            faucibus, pellentesque in tellus. Sed vel sapien eu urna lacinia
            pellentesque. Cras egestas metus sed pretium efficitur. Sed eget
            faucibus nunc. Ut urna nunc, ultricies pretium leo at, consequat
            blandit lorem. Mauris fermentum massa libero, non feugiat lectus
            suscipit ut. Cras sed pellentesque ante. Etiam felis orci, blandit
            in porta a, bibendum eu est. Fusce elit ante, molestie sed quam ut,
            semper porta orci. Nullam porta vehicula sagittis. Donec ultrices
            eleifend enim at venenatis. Fusce maximus nulla lectus, et pharetra
            ex ornare condimentum. Suspendisse ac feugiat dolor. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Suspendisse porttitor fringilla augue sed dictum.
            Duis scelerisque in nunc a luctus. Phasellus at augue et mauris
            interdum molestie. Proin nec neque ligula. Nam varius odio quis nisi
            pulvinar venenatis. Nunc tincidunt sapien a mauris tempus fermentum.
            Suspendisse porttitor mi a blandit porttitor. Donec sagittis
            efficitur auctor. Donec non condimentum erat. Cras eu diam ante. Ut
            sagittis et ipsum vitae fringilla. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae; Nunc sit
            amet facilisis massa. Donec ac blandit enim.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-2"
          className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
        >
          <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 font-bold">
            Item 2
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed magna
            enim, tempor quis lacinia nec, auctor vitae ex. Ut faucibus mattis
            ultricies. Mauris consectetur nulla quis massa vulputate, a pulvinar
            ex condimentum. In condimentum mattis justo, sed pellentesque arcu
            dapibus nec. Nulla facilisi. Aliquam laoreet urna ornare odio luctus
            efficitur. Duis sodales, velit in mollis blandit, mi arcu posuere
            erat, id venenatis lacus sem nec lacus. Aenean sit amet facilisis
            dolor. Morbi dictum mi nisi, sed varius nibh dictum ac. Nunc vitae
            efficitur turpis. Ut eu neque luctus, venenatis ex ut, ornare ante.
            Vivamus nunc erat, dictum in risus sit amet, hendrerit aliquet odio.
            Nam molestie eget lacus quis rhoncus. Ut iaculis ex at gravida
            vulputate. Morbi urna nunc, tristique in aliquam non, facilisis non
            arcu. In fringilla enim a aliquet aliquet. Pellentesque felis lorem,
            suscipit a velit id, aliquet tempor mauris. Suspendisse condimentum,
            turpis sit amet pellentesque accumsan, orci mauris lobortis justo,
            in aliquam eros risus in ex. Sed sollicitudin vestibulum quam, vitae
            rutrum sem faucibus eget. Duis mauris ligula, maximus at malesuada
            faucibus, pellentesque in tellus. Sed vel sapien eu urna lacinia
            pellentesque. Cras egestas metus sed pretium efficitur. Sed eget
            faucibus nunc. Ut urna nunc, ultricies pretium leo at, consequat
            blandit lorem. Mauris fermentum massa libero, non feugiat lectus
            suscipit ut. Cras sed pellentesque ante. Etiam felis orci, blandit
            in porta a, bibendum eu est. Fusce elit ante, molestie sed quam ut,
            semper porta orci. Nullam porta vehicula sagittis. Donec ultrices
            eleifend enim at venenatis. Fusce maximus nulla lectus, et pharetra
            ex ornare condimentum. Suspendisse ac feugiat dolor. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Suspendisse porttitor fringilla augue sed dictum.
            Duis scelerisque in nunc a luctus. Phasellus at augue et mauris
            interdum molestie. Proin nec neque ligula. Nam varius odio quis nisi
            pulvinar venenatis. Nunc tincidunt sapien a mauris tempus fermentum.
            Suspendisse porttitor mi a blandit porttitor. Donec sagittis
            efficitur auctor. Donec non condimentum erat. Cras eu diam ante. Ut
            sagittis et ipsum vitae fringilla. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae; Nunc sit
            amet facilisis massa. Donec ac blandit enim.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-3"
          className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
        >
          <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 font-bold">
            Item 3
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed magna
            enim, tempor quis lacinia nec, auctor vitae ex. Ut faucibus mattis
            ultricies. Mauris consectetur nulla quis massa vulputate, a pulvinar
            ex condimentum. In condimentum mattis justo, sed pellentesque arcu
            dapibus nec. Nulla facilisi. Aliquam laoreet urna ornare odio luctus
            efficitur. Duis sodales, velit in mollis blandit, mi arcu posuere
            erat, id venenatis lacus sem nec lacus. Aenean sit amet facilisis
            dolor. Morbi dictum mi nisi, sed varius nibh dictum ac. Nunc vitae
            efficitur turpis. Ut eu neque luctus, venenatis ex ut, ornare ante.
            Vivamus nunc erat, dictum in risus sit amet, hendrerit aliquet odio.
            Nam molestie eget lacus quis rhoncus. Ut iaculis ex at gravida
            vulputate. Morbi urna nunc, tristique in aliquam non, facilisis non
            arcu. In fringilla enim a aliquet aliquet. Pellentesque felis lorem,
            suscipit a velit id, aliquet tempor mauris. Suspendisse condimentum,
            turpis sit amet pellentesque accumsan, orci mauris lobortis justo,
            in aliquam eros risus in ex. Sed sollicitudin vestibulum quam, vitae
            rutrum sem faucibus eget. Duis mauris ligula, maximus at malesuada
            faucibus, pellentesque in tellus. Sed vel sapien eu urna lacinia
            pellentesque. Cras egestas metus sed pretium efficitur. Sed eget
            faucibus nunc. Ut urna nunc, ultricies pretium leo at, consequat
            blandit lorem. Mauris fermentum massa libero, non feugiat lectus
            suscipit ut. Cras sed pellentesque ante. Etiam felis orci, blandit
            in porta a, bibendum eu est. Fusce elit ante, molestie sed quam ut,
            semper porta orci. Nullam porta vehicula sagittis. Donec ultrices
            eleifend enim at venenatis. Fusce maximus nulla lectus, et pharetra
            ex ornare condimentum. Suspendisse ac feugiat dolor. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Suspendisse porttitor fringilla augue sed dictum.
            Duis scelerisque in nunc a luctus. Phasellus at augue et mauris
            interdum molestie. Proin nec neque ligula. Nam varius odio quis nisi
            pulvinar venenatis. Nunc tincidunt sapien a mauris tempus fermentum.
            Suspendisse porttitor mi a blandit porttitor. Donec sagittis
            efficitur auctor. Donec non condimentum erat. Cras eu diam ante. Ut
            sagittis et ipsum vitae fringilla. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae; Nunc sit
            amet facilisis massa. Donec ac blandit enim.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-4"
          className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
        >
          <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 font-bold">
            Item 4
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed magna
            enim, tempor quis lacinia nec, auctor vitae ex. Ut faucibus mattis
            ultricies. Mauris consectetur nulla quis massa vulputate, a pulvinar
            ex condimentum. In condimentum mattis justo, sed pellentesque arcu
            dapibus nec. Nulla facilisi. Aliquam laoreet urna ornare odio luctus
            efficitur. Duis sodales, velit in mollis blandit, mi arcu posuere
            erat, id venenatis lacus sem nec lacus. Aenean sit amet facilisis
            dolor. Morbi dictum mi nisi, sed varius nibh dictum ac. Nunc vitae
            efficitur turpis. Ut eu neque luctus, venenatis ex ut, ornare ante.
            Vivamus nunc erat, dictum in risus sit amet, hendrerit aliquet odio.
            Nam molestie eget lacus quis rhoncus. Ut iaculis ex at gravida
            vulputate. Morbi urna nunc, tristique in aliquam non, facilisis non
            arcu. In fringilla enim a aliquet aliquet. Pellentesque felis lorem,
            suscipit a velit id, aliquet tempor mauris. Suspendisse condimentum,
            turpis sit amet pellentesque accumsan, orci mauris lobortis justo,
            in aliquam eros risus in ex. Sed sollicitudin vestibulum quam, vitae
            rutrum sem faucibus eget. Duis mauris ligula, maximus at malesuada
            faucibus, pellentesque in tellus. Sed vel sapien eu urna lacinia
            pellentesque. Cras egestas metus sed pretium efficitur. Sed eget
            faucibus nunc. Ut urna nunc, ultricies pretium leo at, consequat
            blandit lorem. Mauris fermentum massa libero, non feugiat lectus
            suscipit ut. Cras sed pellentesque ante. Etiam felis orci, blandit
            in porta a, bibendum eu est. Fusce elit ante, molestie sed quam ut,
            semper porta orci. Nullam porta vehicula sagittis. Donec ultrices
            eleifend enim at venenatis. Fusce maximus nulla lectus, et pharetra
            ex ornare condimentum. Suspendisse ac feugiat dolor. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Suspendisse porttitor fringilla augue sed dictum.
            Duis scelerisque in nunc a luctus. Phasellus at augue et mauris
            interdum molestie. Proin nec neque ligula. Nam varius odio quis nisi
            pulvinar venenatis. Nunc tincidunt sapien a mauris tempus fermentum.
            Suspendisse porttitor mi a blandit porttitor. Donec sagittis
            efficitur auctor. Donec non condimentum erat. Cras eu diam ante. Ut
            sagittis et ipsum vitae fringilla. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae; Nunc sit
            amet facilisis massa. Donec ac blandit enim.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-2.5" />
        <CarouselNext className="-right-2.5" />
      </Carousel>
    </>
  );
}
