import { ReviewProps } from '@/types/review';
import React from 'react';

const Review: React.FC<ReviewProps> = ({ review, onEdit, onDelete }) => {
  return (
    <div>
      <h2>{review.comment}</h2>
      <p>Rating: {review.rating}</p>
      <p>Created At: {review.createdAt}</p>
      <button onClick={() => onEdit(review.id)}>Edit</button>
      <button onClick={() => onDelete(review.id)}>Delete</button>
    </div>
  );
};

export default Review;
