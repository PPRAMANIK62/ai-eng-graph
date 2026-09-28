"use client";

import { useState } from "react";
import Link from "next/link";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import { mapHref } from "./trip";
import s from "./transit.module.css";

export type ZoneLink = { phase: number; name: string; /** Readable home stations; 0 means the zone opens later. */ stops: number };

/** The zone plate on the sign bar, opening a strip map of every zone. Plain links, so the trip (?to=) rides along. */
export function ZoneSwitch({ zones, phase, to }: { zones: ZoneLink[]; phase: number; to: string | null }) {
  const [open, setOpen] = useState(false);
  const here = zones.find(z => z.phase === phase)!;
  const running = zones.filter(z => z.stops > 0);
  const later = zones.filter(z => z.stops === 0);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className={s.zoneTrigger} aria-label={`Zone ${here.phase}, ${here.name}. Change zone`}>
        <span className={s.zonePlate}>
          Zone <b>{here.phase}</b>
        </span>
        <span className={s.zoneName}>{here.name}</span>
        <ChevronDown size={14} className={s.zoneChevron} aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={8} collisionPadding={16} className={s.zonePositioner}>
          <Popover.Popup className={s.zonePanel} aria-label="Zones">
            <ol className={s.zoneStrip}>
              {running.map((z, i) => (
                <li key={z.phase} className={s.zoneStop} data-last={i === running.length - 1}>
                  <Link
                    href={mapHref(z.phase, to)}
                    className={s.zoneRow}
                    aria-current={z.phase === phase ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className={s.zoneGlyph} aria-hidden />
                    <span className={s.zoneNum}>{z.phase}</span>
                    <span className={s.zoneRowName}>{z.name}</span>
                    <span className={s.zoneCount}>{z.stops} stops</span>
                  </Link>
                </li>
              ))}
              {later.length > 0 && (
                <li className={s.zoneLater}>
                  <span className={s.zoneLaterTitle}>Opening later</span>
                  <ol className={s.zoneStrip}>
                    {later.map((z, i) => (
                      <li key={z.phase} className={s.zoneStop} data-later data-last={i === later.length - 1}>
                        <span className={s.zoneRow}>
                          <span className={s.zoneGlyph} aria-hidden />
                          <span className={s.zoneNum}>{z.phase}</span>
                          <span className={s.zoneRowName}>{z.name}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </li>
              )}
            </ol>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
