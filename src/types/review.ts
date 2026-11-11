export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  avatarUrl?: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  helpfulCount: number;
  wasteMaterialTag?: string;
}

export interface ReviewRatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: ReviewRatingDistribution[];
}

export interface NewReviewPayload {
  authorName: string;
  rating: number;
  title: string;
  comment: string;
}
