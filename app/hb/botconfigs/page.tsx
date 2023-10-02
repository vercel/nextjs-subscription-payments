import {
  getSession
} from '@/app/supabase-server';
import React, { useEffect, useRef, useState } from 'react';
import ConfigsTable from './components/ConfigsTable';
import {Button} from '@/components/ui/button';
import { redirect } from 'next/navigation';



export default async function BotConfigs() {
  const [session] = await Promise.all([
    getSession(),
  ]);

  const user = session?.user;

  if (!session) {
    return redirect('/signinhb');
  }

  const [toggle, setToggle] = useState<string>('view');

return (
  <>
    <div className="w-full p-8 overflow-y-auto">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bot Configs</h2>
        <Button className='p-3 border-2 border-logoColor text-logoColor'>
          Create a config
        </Button>
      </div>
      <div className={`${toggle === 'view' ? 'block' : 'hidden'} mt-8`}>
        <ConfigsTable />
      </div>
    </div>
  </>
  )
}
