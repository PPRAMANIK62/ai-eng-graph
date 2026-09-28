import type { Metadata } from "next";
import { zoneLabel } from "@/lib/phases";
import { ZonePage, getAtlas } from "@/components/transit/zone-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAtlas()
    .zones.filter(z => z.phase !== 1)
    .map(z => ({ zone: String(z.phase) }));
}

export async function generateMetadata({ params }: PageProps<"/zone/[zone]">): Promise<Metadata> {
  return { title: zoneLabel(Number((await params).zone)) };
}

export default async function ZoneMapPage({ params }: PageProps<"/zone/[zone]">) {
  return <ZonePage phase={Number((await params).zone)} />;
}
