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
