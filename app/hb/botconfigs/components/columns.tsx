"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EyeOpenIcon } from "@radix-ui/react-icons"
import Image from "next/image"

import { labels, statuses } from "../data/data"
import { BConfig } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<BConfig>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "channel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Channel" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.channel_platform)

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
          <p>{row.getValue("channel")}</p>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "list",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="List" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {row.getValue("list")}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "video_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Video Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("video_name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "endscreen",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Endscreen" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("endscreen")}{row.getValue("endscreen") === "true" ? `(${row.getValue("endscreen_model")})` : ""}</div>,
  },
  {
    accessorKey: "thumb_algo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="T.A." />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("thumb_algo") === "true" ? "Yes" : "No"}</div>,
  },
  {
    accessorKey: "cores",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cores" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("cores")}</div>,
  },
  {
    accessorKey: "vc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Video Config" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("vc")}</div>,
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
          <span className={`
            ${status.value === "true" ? "text-[#33bbcf]" : "text-red-600"}
          `}>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]