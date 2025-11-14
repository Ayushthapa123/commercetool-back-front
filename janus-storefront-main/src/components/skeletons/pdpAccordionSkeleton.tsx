import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

export function PDPAccordionSkeleton() {
  return (
    <Accordion type="multiple">
      <AccordionItem
        value="item-1"
        className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
      >
        <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 flex w-full px-4 py-6 font-bold">
          Manuals & Documents
        </AccordionTrigger>
        <AccordionContent></AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="item-2"
        className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
      >
        <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 flex w-full px-4 py-6 font-bold">
          Specifications
        </AccordionTrigger>
        <AccordionContent></AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="item-3"
        className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
      >
        <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 flex w-full px-4 py-6 font-bold">
          Product Details
        </AccordionTrigger>
        <AccordionContent></AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="item-4"
        className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
      >
        <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 flex w-full px-4 py-6 font-bold">
          What&apos;s Included
        </AccordionTrigger>
        <AccordionContent></AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="item-5"
        className="[&[data-state=open]]:border-secondary-cyan border-t-1 border-b-0 [&[data-state=open]]:border-t-4"
      >
        <AccordionTrigger className="[&[data-state=open]]:text-neutral-black text-neutral-black-50 flex w-full px-4 py-6 font-bold">
          Repairs Parts
        </AccordionTrigger>
        <AccordionContent></AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
