import { Injectable, signal } from '@angular/core';

export interface InboxMessage {
    id: string;
    title: string;
    body: string;
    timestamp: Date;
    read: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class InboxService {
    messages = signal<InboxMessage[]>([]);
    isOpen = signal(false);

    constructor() {
        this.generateDemoOtps();
    }

    private generateDemoOtps() {
        const demoMessages: InboxMessage[] = [
            {
                id: crypto.randomUUID(),
                title: 'Movie Access Code',
                body: 'Your access code for The Matrix is 4521.',
                timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
                read: false
            },
            {
                id: crypto.randomUUID(),
                title: 'Movie Access Code',
                body: 'Your access code for Inception is 8892.',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                read: false
            },
            {
                id: crypto.randomUUID(),
                title: 'Welcome Gift',
                body: 'Here is a 50% discount code for your next movie: MOVIE50',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                read: true
            }
        ];

        this.messages.set(demoMessages);
    }

    generateAndSendOtp(itemName: string): string {
        // Generate 4 separate random digits (0-9) ensuring each is random and leading zeros are possible
        const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
        const code = digits.join('');

        const title = `Access Code: ${itemName}`;

        // Clear previous codes for this item
        this.removeMessagesByTitle(title);

        // Send new code
        this.addMessage(
            title,
            `Your access code for "${itemName}" is: ${code}`
        );

        return code;
    }

    addMessage(title: string, body: string) {
        const newMessage: InboxMessage = {
            id: crypto.randomUUID(),
            title,
            body,
            timestamp: new Date(),
            read: false
        };

        this.messages.update(msgs => [newMessage, ...msgs]);
    }

    deleteMessage(id: string) {
        this.messages.update(msgs => msgs.filter(m => m.id !== id));
    }

    // Remove messages that contain specific text (useful for clearing old OTPs)
    removeMessagesByTitle(title: string) {
        this.messages.update(msgs => msgs.filter(m => m.title !== title));
    }

    markAsRead(id: string) {
        this.messages.update(msgs => msgs.map(m =>
            m.id === id ? { ...m, read: true } : m
        ));
    }

    clearAll() {
        this.messages.set([]);
    }

    toggleInbox() {
        this.isOpen.update(v => !v);
    }
}
