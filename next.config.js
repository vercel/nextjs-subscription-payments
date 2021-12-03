// For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

// NEXT_PUBLIC_SUPABASE_URL = 'https://awhyjfxvdydwglsjirlz.supabase.co',
// NEXT_PUBLIC_SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODMwOTM4NiwiZXhwIjoxOTUzODg1Mzg2fQ.xuzovkgX-lTULqr55aM6PluaRR9USj5yjsmhzwmgKUo'
