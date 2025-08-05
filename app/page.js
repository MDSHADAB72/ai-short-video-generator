import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h2> Hello SHip</h2>
      <Button variant="destructive"> Ship Buyer</Button>

      <UserButton />
    </div>
  );
}
