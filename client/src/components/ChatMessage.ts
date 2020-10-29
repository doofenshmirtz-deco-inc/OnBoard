/**
 * Type interface for chat messages. Contains all information needed to render
 * a chat message, including sender, position, group, time, and others.
 */
interface ChatMessage {
  text: string;
  sender: string;
  senderName: string;
  direction: "left" | "right";
  groupId: string;
  group: boolean;
  createdAt: Date;
}

export default ChatMessage;
