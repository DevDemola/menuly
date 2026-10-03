import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { photos } from "@/lib/images";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[58%]">
        <Photo src={photos.grill} alt="" className="h-full w-full" tone="warm" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10 md:via-ink/40" />
      </div>
      <div className="container-x py-24 md:py-36">
        <p className="eyebrow !text-paper/60">Ready when you are</p>
        <h2 className="display-xl mt-5 max-w-[11ch]">
          Give your menu a better <span className="text-orange">home.</span>
        </h2>
        <p className="mt-6 max-w-[30rem] text-lg leading-relaxed text-paper/75">
          Set up your Menuly menu and share it with your customers today.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/signup" size="lg">
            Create your menu <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink
            href="/m/ofada-house"
            size="lg"
            variant="secondaryLight"
          >
            Explore a demo
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
