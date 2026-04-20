import { GARDEN } from "@/lib/garden";
import { TwelvePointStar, MangoLeaf } from "./Decorations";

export const SiteFooter = () => (
  <footer className="bg-primary text-primary-foreground pt-16 pb-8 mt-16">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-10 items-start">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <MangoLeaf className="w-5 h-5" />
            </div>
            <span className="font-display text-2xl">{GARDEN.shortName}</span>
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed font-sub">{GARDEN.location}</p>
          <p className="text-primary-foreground/55 text-xs mt-3 font-sub">Established {GARDEN.established}</p>
        </div>

        <div className="flex justify-center">
          <TwelvePointStar className="w-24 h-24 text-accent opacity-80" />
        </div>

        <div className="md:text-right">
          <p className="font-display text-xl text-accent-light italic mb-2">Built with care for every tree ﷺ</p>
          <p className="text-primary-foreground/60 text-xs font-sub">A living digital record — updated as the garden grows.</p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-primary-foreground/15 flex flex-col sm:flex-row justify-between gap-2 text-xs text-primary-foreground/50 font-sub">
        <span>© {new Date().getFullYear()} {GARDEN.name}</span>
        <span>Hambantota, Sri Lanka</span>
      </div>
    </div>
  </footer>
);
