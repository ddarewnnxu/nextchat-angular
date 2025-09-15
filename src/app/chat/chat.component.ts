import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  messages: ChatMessage[] = [];
  input = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: this.input };
    this.messages.push(userMessage);
    this.input = '';

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    this.messages.push(assistantMessage);
    this.loading = true;

    this.chatService.streamMessage(this.messages).subscribe({
      next: (token) => (assistantMessage.content += token),
      complete: () => (this.loading = false),
      error: () => {
        assistantMessage.content += '\n⚠️ 回覆錯誤';
        this.loading = false;
      },
    });
  }
}
