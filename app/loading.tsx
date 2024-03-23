import { Loader } from 'lucide-react';
import React from 'react';

export default function loading() {
  return (
    <div className="w-full h-fit flex justify-center items-center">
      <Loader size={14} className='animate-spin'/>
    </div>
  );
}
