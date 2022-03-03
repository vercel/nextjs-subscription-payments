import { handleAuth } from '@supabase/supabase-auth-helpers/nextjs';

export default handleAuth({ logout: { returnTo: '/signin' } });
