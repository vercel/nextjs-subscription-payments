"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EyeOpenIcon } from "@radix-ui/react-icons"
import Image from "next/image"

import { labels, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("date")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "platform",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Platform" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.platform)

      if (!label) {
        return null
      }

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline" className={`
          ${label.label === "Youtube" ? "bg-[#ff0000] text-white font-bold" : ""}
          ${label.label === "Facebook" ? "bg-[#3a559f] text-white font-bold" : ""}
          ${label.label === "Tiktok" ? "bg-white text-black font-bold" : ""}
          `}>
                {label.label}
            </Badge>}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "chan_page",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Channel/Page" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.platform)

      if (!label) {
        return null
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("chan_page")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className={`mr-2 h-4 w-4 ${status.label === "Succeeded" ? "text-[#33bbcf]" : "text-red-600"}`} />
          )}
          <span className={`
            ${status.label === "Succeeded" ? "text-[#33bbcf]" : "text-red-600"}
          `}>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "thumb_path",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thumbnail" />
    ),
    cell: ({ row }) => {
      const thumbnail = row.getValue("thumb_path")

      if (!thumbnail) {
        return null
      }

      return (
        <div className="flex items-center justify-center max-w-[92px]">
          <Popover>
            <PopoverTrigger>
                <EyeOpenIcon className="mr-2 h-4 w-4 text-muted-foreground"/>
            </PopoverTrigger>
            <PopoverContent>
                <Image
                    src={row.getValue("thumb_path")}
                    alt="thumbnail"
                    width={320}
                    height={180}
                    className={"h-[180px] w-[320px] object-cover transition-all"}
                />
            </PopoverContent>
          </Popover>
        </div>
      )
    },
    enableSorting: false,
  },
]