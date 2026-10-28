import { Container } from 'react-bootstrap';
import MovieCatalogue from '../../components/MovieCatalogue.jsx';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { moviesApi } from '../../services/api.js';

export default function Home() {
  const { user } = useAuth();
  const featured = useFetch(() => moviesApi.list({ limit: 1 }), []);
  const featuredMovie = featured.data?.data?.[0];

  return (
    <div>
      {/* Featured Spotlight Banner */}
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      <Container className="py-4">
        <header className="im-page-head d-flex justify-content-between align-items-end flex-wrap gap-2">
          <div>
            <h2 className="im-section-title">
              {user ? `Welcome back, ${user.username} 👋` : 'Now Showing in Theatres'}
            </h2>
            <p className="text-secondary mb-0">Browse latest releases, pick your favourite showtimes, and book your seats.</p>
          </div>
        </header>

        <MovieCatalogue pageSize={8} />
      </Container>
    </div>
  );
}
