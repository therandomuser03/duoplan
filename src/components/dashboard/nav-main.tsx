"use client"

import Link from "next/link";
import { type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    disabled?: boolean
    tooltip?: string
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      disabled={item.disabled}
                      className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <Link 
                        href={item.url} 
                        className={`flex items-center gap-2 ${item.disabled ? "pointer-events-none" : ""}`}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {item.tooltip && (
                    <TooltipContent>
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
