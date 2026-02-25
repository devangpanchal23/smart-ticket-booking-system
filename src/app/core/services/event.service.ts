import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs, Timestamp } from '@angular/fire/firestore';
import { Event } from '../models/user.model'; // I put Event in user.model.ts for now, better to separate but it works.

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private firestore = inject(Firestore);
    private eventsCollection!: ReturnType<typeof collection>;

    constructor() {
        this.eventsCollection = collection(this.firestore, 'events');
    }

    async createEvent(event: Omit<Event, 'eventId' | 'createdAt'>) {
        const docRef = await addDoc(this.eventsCollection, {
            ...event,
            createdAt: Timestamp.now()
        });
        // Update the doc with its own ID (optional but useful)
        await updateDoc(doc(this.firestore, `events/${docRef.id}`), { eventId: docRef.id });
        return docRef.id;
    }

    async getEvents() {
        const snapshot = await getDocs(this.eventsCollection);
        return snapshot.docs.map(doc => doc.data() as Event);
    }
}
