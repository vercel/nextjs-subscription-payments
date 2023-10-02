'use client';

import Button from '@/components/ui/Button/Button';
import { postData } from '@/utils/helpers';
import { Database, Json } from '@/types_db';
import { Session, createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Props {
  session: Session;
  sub: Database['public']['Tables']['subscriptions']['Row'] | null;
}

export default function ManageDownloadButton({ session, sub }: Props) {
  const router = useRouter();
  const handleDownload = async () => {
    if (sub) {
      const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')
      const user = session?.user;
      const { data, error } = await supabase
      .storage
      .from('testfile')
      .createSignedUrl('neotest3.exe', 5, {
        download: true,
      })
      if (data) {
        const dlLink = document.createElement('a');
        dlLink.href = data.signedUrl
        dlLink.download = "neotest3.exe"
        dlLink.style.display = 'none';
        document.body.appendChild(dlLink);
        dlLink.click()
        document.body.removeChild(dlLink);
      } else if (error) {
        console.log("pas la bonne méthode pour dl: ", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">Download the beast !!!</p>
      <Button
        variant="slim"
        disabled={!session || !sub}
        onClick={handleDownload}
      >
        Download
      </Button>
    </div>
  );
}
