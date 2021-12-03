import { useState, useEffect } from 'react';

export default function useUserMedia(requestedMedia) {
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          requestedMedia
        );
        setMediaStream(stream);
      } catch (err) {
        // Removed for brevity
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia]);

  return mediaStream;
}
