export interface Message {
  id: number;
  senderId: number;
  senderKnownAs: string;
  senderPotoUrl: string;
  recipientId: number;
  recipientKnownAs: string;
  recipientPotoUrl: string;
  content: string;
  dateRead: Date;
  isRead: boolean;
  messageSent: Date;
}
