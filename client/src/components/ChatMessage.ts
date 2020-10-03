interface ChatMessage {
  text: string;
  sender: string;
  direction: "left" | "right";
  groupId: string;
  createdAt: Date;
}

export default ChatMessage;
