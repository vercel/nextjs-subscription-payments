/* eslint-disable prettier/prettier */
import Link from "next/link";
import { navLinks, bottomSideLinks } from "./constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip"
import { cn } from "@/utils";

type NavLinkType = {
  id: string;
  path: string;
  icon: string;
  title: string;
}

function Sidebar() {
  return (
    <div className="sticky top-0 list-none w-[70px] px-3 h-screen sidebar flex items-start flex-col bg-sidebar border-r-[1px] border-gray-600">
      <div className="userPP w-[50px] h-[50px] rounded-full bg-slate-100 my-5 mx-auto">
        
      </div>
      {navLinks.map((item: NavLinkType) => (
        <li key={item.id} className={`my-4 mx-auto ${item.id === "notifications" ? "w-[80%] flex justify-center pb-5 border-b-2 border-slate-50" : ""}`}>
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={item.path}
                  className=""
                  >
                  <img src={item.icon} alt={`${item.id} icon`} className="w-[25px] h-auto"/>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.title}</p>
                <TooltipArrow className="fill-white" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      ))}
      <div className="absolute left-0 bottom-3 w-full flex flex-col">
        {bottomSideLinks.map((item: NavLinkType) => (
          <li key={item.id} className="my-4 mx-auto">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={item.path}
                    className=""
                    >
                    <img src={item.icon} alt={`${item.id} icon`} className="w-[25px] h-auto"/>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.title}</p>
                  <TooltipArrow className="fill-white" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
