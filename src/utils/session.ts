// src/utils/session.ts

/**
 * Generates a unique, anonymous session ID for the current browser
 * and stores it in localStorage so it persists across visits.
 */
export const getOrCreateSessionId = (): string => {
    const STORAGE_KEY = "guest_session_id";

    let sessionId = localStorage.getItem(STORAGE_KEY);

    if (!sessionId) {
        // Generates a random string like "x8f9q2m4v3k"
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem(STORAGE_KEY, sessionId);
    }

    return sessionId;
};