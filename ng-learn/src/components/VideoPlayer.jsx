import { useEffect, useRef, useState } from 'react';
import { Play } from './icons.jsx';

export default function VideoPlayer({ section }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);

  const videoSrc = section.hasVideo && section.videoFile
    ? `/videos/${section.videoFile}`
    : null;

  useEffect(() => {
    setError(false);
    setPlaying(false);
  }, [section.id]);

  if (!videoSrc || error) {
    return (
      <div className="video-placeholder">
        <div className="vp-bg" />
        <div className="vp-content">
          <div className="vp-icon">
            <Play size={32} />
          </div>
          <h4>Video Coming Soon</h4>
          <p>Section {section.order}: {section.title}</p>
          <span className="vp-duration">~{section.estimatedMinutes} min estimated</span>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        controlsList="nodownload"
        playsInline
        preload="metadata"
        onError={() => setError(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{ width: '100%', borderRadius: 'var(--radius)', background: '#000' }}
      />
    </div>
  );
}
