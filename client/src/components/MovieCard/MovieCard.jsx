import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiCalendar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import PosterImage from '../PosterImage.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { formatDuration } from '../../utils/format.js';

export default function MovieCard({ movie, onRemoveFavorite }) {
  const { user, isAdmin } = useAuth();
  const favs = useFavorites();
  const fav = favs?.isFavorite(movie._id);

  const onHeart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFav = await favs.toggle(movie._id);
    if (!nowFav && onRemoveFavorite) onRemoveFavorite(movie._id);
  };

  return (
    <article className="im-card">
      <Link to={`/movies/${movie._id}`} className="im-card-link" aria-label={`${movie.name} — details`}>
        <div className="im-poster-wrap">
          <PosterImage src={movie.posterUrl} alt={`${movie.name} poster`} className="im-poster" />
          
          {/* Floating glass rating badge on top-left */}
          {movie.rating ? (
            <div className="im-card-badge-rating">
              <FiStar aria-hidden="true" />
              <span>{movie.rating}</span>
            </div>
          ) : (
            <div className="im-card-badge-rating im-card-badge-new">
              <span>New</span>
            </div>
          )}

          {/* Certificate */}
          <span className="im-cert">{movie.certificate}</span>

          {/* Quick Book hover overlay */}
          <div className="im-card-overlay">
            <span className="im-card-overlay-btn">View Details & Book</span>
          </div>
        </div>

        <div className="im-card-body">
          <h3 className="im-card-title" title={movie.name}>{movie.name}</h3>
          <p className="im-card-meta im-card-genres">{movie.genres?.slice(0, 2).join(' · ')}</p>
          <div className="im-card-footer-info">
            <span className="im-card-lang">{movie.language}</span>
            <span className="im-card-dot">•</span>
            <span className="im-card-duration">{formatDuration(movie.duration)}</span>
          </div>
        </div>
      </Link>

      {user && !isAdmin && (
        <button
          type="button"
          className={`im-heart ${fav ? 'on' : ''}`}
          onClick={onHeart}
          aria-pressed={!!fav}
          aria-label={fav ? `Remove ${movie.name} from favorites` : `Add ${movie.name} to favorites`}
        >
          {fav ? <FaHeart /> : <FiHeart />}
        </button>
      )}
    </article>
  );
}
