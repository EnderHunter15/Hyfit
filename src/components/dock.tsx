import { links } from "@/utils/types";
import Link from "next/link";
import { Separator } from "./ui/separator";

export default function Dock() {
  return (
    <div className="bg-secondary fixed bottom-0 flex w-full flex-col items-center justify-between">
      <Separator className="bg-primary rounded-2xl p-0.5" />
      <div className="flex w-full justify-between p-4">
        {links.map((link) => {
          const { href, label, icon: Icon } = link;
          return (
            <div key={label} className="flex flex-row space-x-4">
              <Link
                href={href}
                className="flex flex-col items-center space-y-1"
              >
                <Icon className="text-foreground" />
                <span className="text-primary capitalize">{label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
