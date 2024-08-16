import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";

("u");
const Actions = () => {
  return (
    <div className=" flex items-center gap-x-2 justify-end">
      <Button size={"sm"} variant={"ghost"} className=" text-muted-foreground hover:text-primary" asChild>
        <Link href={"/"}>
          <LogOut className=" h-5 w-5 mr-2 " />
          Exit
        </Link>
      </Button>
      <UserButton />
    </div>
  );
};

export default Actions;
