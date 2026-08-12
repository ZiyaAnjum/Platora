import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="label-eyebrow">Table not found</p>
      <h1 className="mt-2 font-display text-3xl text-ink">This page isn't on the menu.</h1>
      <Link to="/menu" className="btn-primary mt-6 inline-flex">
        Back to the menu
      </Link>
    </div>
  );
}
