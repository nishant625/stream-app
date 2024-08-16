"use client";

import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { startTransition, useTransition } from "react";
import { toast } from "sonner";

type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";
interface ToggleCardProps {
  label: string;
  value: boolean;
  field: FieldTypes;
}
const ToggleCard = ({ label, field, value}: ToggleCardProps) => {
  const [isPending, startTransition] = useTransition();
  const onChange = () => {
    startTransition(() => {
      updateStream({ [field]: !value })  // Toggle the value here
        .then(() => toast.success("Chat settings updated"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className=" rounded-xl bg-muted p-6">
      <div className=" flex items-center justify-between">
        <p className=" font-semibold shrink-0">{label}</p>
        <div className=" space-y-2">
          <Switch disabled={isPending} onCheckedChange={onChange}    checked={value}>{value ? "On" : "Off"}</Switch>
        </div>
      </div>
    </div>
  );
};

export default ToggleCard;


export const ToggleCardSkeleton=()=>{
    return(
        <Skeleton className=" rounded-xl p-10 w-full"/>
    )
}
