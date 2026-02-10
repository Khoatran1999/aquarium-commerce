import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 – AquaLuxe</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center px-4 py-24 text-center md:px-10">
        <h1 className="text-primary text-7xl font-black">404</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="bg-primary mt-6 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}
