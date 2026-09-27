export interface ParsedVideo {
  type: 'direct' | 'youtube' | 'vimeo';
  embedUrl: string;
  originalUrl: string;
}

export function parseVideoUrl(url: string): ParsedVideo {
  if (!url) {
    return { type: 'direct', embedUrl: '', originalUrl: '' };
  }

  const trimmed = url.trim();

  // YouTube match: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const youtubeMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`,
      originalUrl: trimmed,
    };
  }

  // Vimeo match: vimeo.com/ID
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0&color=f4f4f5`,
      originalUrl: trimmed,
    };
  }

  // Direct MP4 / WebM / Cloud video
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed,
  };
}
