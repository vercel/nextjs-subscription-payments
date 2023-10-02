import { z } from "zod"
import { historic } from "../data/historic"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { UserNav } from "./user-nav"
import { taskSchema } from "../data/schema"

export default function TaskPage() {
  const tasks = historic

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  )
}