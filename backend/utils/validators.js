const ALLOWED_ENROLLMENTS = [
  ...Array.from({ length: 71 }, (_, i) => `25bt04${String(70 + i).padStart(3, '0')}`),
  '25bt04219',
  '25bt04220',
  '25bt04221',
  'admin'
];

export const isValidEnrollment = (enrollmentNumber) => {
  return ALLOWED_ENROLLMENTS.includes(enrollmentNumber.toLowerCase());
};

export const validateVoteData = (ratings, criteria) => {
  if (!Array.isArray(ratings) || ratings.length !== criteria.length) {
    return false;
  }

  return ratings.every(rating => 
    rating.rating >= 1 && 
    rating.rating <= 5 && 
    criteria.some(c => c.name === rating.criteriaName)
  );
};