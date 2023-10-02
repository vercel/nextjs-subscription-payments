import { z } from "zod"
import { bconfigs } from "../data/bconfigs"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { UserNav } from "./user-nav"
import { bConfigSchema } from "../data/schema"

export default function ConfigsTable() {
  const conf = bconfigs

  return (
    <>
      <div className="min-w-[100%] h-screen max-h-screen relative flex flex-row overflow-hidden">
        <DataTable data={conf} columns={columns} />
      </div>
    </>
  )
}