import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ModelCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ModelCard({ icon: Icon, title, description }: ModelCardProps) {
  return (
    <Card className="h-full hover:shadow-soft-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}
