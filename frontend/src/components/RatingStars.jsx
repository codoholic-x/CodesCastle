// ============================================
// FILE: frontend/src/components/RatingStars.jsx
// PURPOSE: Renders a 5-star visual rating (supports half-star
// increments like 0.5, 1, 1.5 ... 5) used to show how well the user
// did on a question based on number of attempts taken.
// ============================================

import "./RatingStars.css";

const RatingStars = ({ rating = 0, showLabel = true }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<span key={i} className="star full">★</span>);
    } else if (rating >= i - 0.5) {
      stars.push(<span key={i} className="star half">☆</span>);
    } else {
      stars.push(<span key={i} className="star">☆</span>);
    }
  }

  return (
    <span className="rating-stars">
      {stars}
      {showLabel && <span className="rating-label">{rating} / 5</span>}
    </span>
  );
};

export default RatingStars;
