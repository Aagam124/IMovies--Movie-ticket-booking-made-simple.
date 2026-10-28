import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import { FiPlay, FiStar, FiCalendar, FiClock } from 'react-icons/fi';
import { formatDuration } from '../../utils/format.js';
import TrailerModal from '../TrailerModal.jsx';

export default function HeroBanner({ movie }) {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) return null;

  return (
    <>
      <div className="im-hero-spotlight">
        <div className="im-hero-bg-overlay" />
        <div className="im-hero-content">
          <div className="im-hero-badge-row">
            <span className="im-trending-pill">🔥 Trending Now</span>
            <span className="im-cert-badge">{movie.certificate}</span>
            <span className="im-hero-meta-item"><FiClock /> {formatDuration(movie.duration)}</span>
            <span className="im-hero-meta-item">{movie.language}</span>
          </div>

          <h1 className="im-hero-title">{movie.name}</h1>

          <div className="im-hero-genres">
            {movie.genres?.map((g) => (
              <span key={g} className="im-hero-genre-tag">{g}</span>
            ))}
            {movie.rating ? (
              <span className="im-hero-rating">
                <FiStar className="text-warning" /> {movie.rating} / 5
              </span>
            ) : null}
          </div>

          <p className="im-hero-desc">{movie.description}</p>

          <div className="im-hero-actions">
            <Button as={Link} to={`/movies/${movie._id}/shows`} variant="danger" size="lg" className="im-btn-glow">
              Book Tickets Now
            </Button>
            {movie.trailerUrl && (
              <Button
                variant="outline-light"
                size="lg"
                className="im-btn-glass"
                onClick={() => setShowTrailer(true)}
              >
                <FiPlay className="me-1" /> Watch Trailer
              </Button>
            )}
            <Button as={Link} to={`/movies/${movie._id}`} variant="link" className="text-light ms-2">
              More Details &rarr;
            </Button>
          </div>
        </div>

        {movie.posterUrl && (
          <div className="im-hero-poster-preview">
            <img src={movie.posterUrl} alt={movie.name} />
          </div>
        )}
      </div>

      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        title={movie.name}
        trailerUrl={movie.trailerUrl}
      />
    </>
  );
}
