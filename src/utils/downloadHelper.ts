/**
 * Triggers a direct, uncorrupted MP4 file download on desktop/local devices.
 * Uses client-side Blob creation to bypass iframe sandbox download blocking,
 * and falls back to the server attachment endpoint.
 */
export async function downloadMp4File(
  filename = 'telugu-claude-code-reel.mp4',
  onStart?: () => void,
  onDone?: () => void,
  onError?: (err: Error) => void
) {
  try {
    if (onStart) onStart();
    const videoUrl = `/api/video/download?filename=${encodeURIComponent(filename)}`;
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename.endsWith('.mp4') ? filename : `${filename}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);
    if (onDone) onDone();
  } catch (error: any) {
    console.warn('Direct Blob download failed, using server stream fallback:', error);
    try {
      const link = document.createElement('a');
      link.href = `/api/video/download?filename=${encodeURIComponent(filename)}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onDone) onDone();
    } catch (fallbackError: any) {
      if (onError) onError(fallbackError);
    }
  }
}
