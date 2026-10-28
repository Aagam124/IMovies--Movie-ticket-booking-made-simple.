import { Modal } from 'react-bootstrap';

export function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      if (parsed.pathname.startsWith('/embed/')) {
        return `https://www.youtube-nocookie.com${parsed.pathname}?autoplay=1&rel=0`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export default function TrailerModal({ show, onHide, title, trailerUrl }) {
  const embedUrl = getYouTubeEmbedUrl(trailerUrl);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered contentClassName="im-modal im-trailer-modal">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="h5">{title ? `${title} — Official Trailer` : 'Movie Trailer'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="im-trailer-frame-wrap">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title || 'Movie Trailer'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="im-trailer-iframe"
            />
          ) : (
            <div className="p-4 text-center">
              <p className="text-secondary mb-3">Trailer preview unavailable directly inside the player.</p>
              {trailerUrl && (
                <a href={trailerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-danger">
                  Open Trailer on YouTube
                </a>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
