import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/chat/stream';

  streamMessage(messages: ChatMessage[]): Observable<string> {
    return new Observable((observer) => {
      const eventSource = new EventSourcePolyfill(this.apiUrl, {
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify({ messages }),
        method: 'POST',
      });

      eventSource.addEventListener('message', (event: any) => {
        observer.next(event.data);
      });

      eventSource.addEventListener('end', () => {
        observer.complete();
        eventSource.close();
      });

      eventSource.addEventListener('error', (err) => {
        observer.error(err);
        eventSource.close();
      });
    });
  }
}
