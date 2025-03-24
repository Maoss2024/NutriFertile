export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_id: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  is_premium: boolean;
  created_at: string;
  expires_at: string | null;
}