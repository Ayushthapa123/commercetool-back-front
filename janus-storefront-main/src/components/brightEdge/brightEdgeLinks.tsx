"use client";

interface Props {
  links: {
    anchor_text: string;
    url: string;
  }[];
}

export function BrightEdgeLinks({ links }: Props) {
  if (links && links.length > 0) {
    return (
      <div className="bg-neutral-black-3 font-roboto mx-0 ml-[calc(-50vw+50%)] flex w-screen max-w-screen flex-col items-center-safe gap-10 py-4">
        <div className="container flex w-full flex-row items-center gap-10 px-2 md:px-0">
          <div className="mr-5 basis-37.5 text-xs uppercase">
            Related Links:
          </div>
          <div className="flex flex-row gap-5 text-sm">
            {links.map((link) => (
              <a key={link.url} href={link.url} className="hover:underline">
                {link.anchor_text}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
