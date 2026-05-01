import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import { ArrowUpRight } from "lucide-react";

export default function DemoOne() {
  return (
    <div className="p-8 flex justify-center items-center h-screen bg-background">
      <ButtonWithIcon icon={ArrowUpRight}>
        Let's Collaborate
      </ButtonWithIcon>
    </div>
  );
}
