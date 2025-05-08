export interface Capsule {
  id: string;
  title: string;
  message: string;
  mediaUrl?: string;
  mediaType?: string;
  createdAt: Date;
  unlockTime: Date;
}