import { env } from "@/env";
import SuperMemory from "supermemory";

export class Memory {
    private static instance: Memory;
    private memory: SuperMemory;

    private constructor() {
        this.memory = new SuperMemory({
            apiKey: env.SUPERMEMORY_API_KEY,
        });
    }

    public static getInstance(): Memory {
        if (!Memory.instance) {
            Memory.instance = new Memory();
        }

        return Memory.instance;
    }

    async saveInMemory(journalText: string, userId: string) {
        const start = Date.now();
        console.log(`[MEMORY:ADD] user=${userId} contentLength=${journalText.length}`);
        try {
            const result = await this.memory.add({
                content: journalText,
                containerTag: userId
            });
            console.log(`[MEMORY:ADD] success user=${userId} duration=${Date.now() - start}ms`);
            return result;
        }
        catch (error) {
            console.error(`[MEMORY:ADD] failed user=${userId} duration=${Date.now() - start}ms error=${String(error)}`);
            throw error;
        }
    }

    async recallMemory(journalText: string, userId: string) {
        const start = Date.now();
        console.log(`[MEMORY:SEARCH] user=${userId} query="${journalText.slice(0, 100)}"`);
        try {
            const result = await this.memory.search.documents({
                q: journalText,
                containerTags: [userId]
            });
            const resultCount = result?.results?.length ?? 0;
            console.log(`[MEMORY:SEARCH] success user=${userId} results=${resultCount} duration=${Date.now() - start}ms`);
            return result;
        }
        catch (error) {
            console.error(`[MEMORY:SEARCH] failed user=${userId} duration=${Date.now() - start}ms error=${String(error)}`);
            throw error;
        }
    }

    async getUserProfile(userId: string) {
        const start = Date.now();
        console.log(`[MEMORY:PROFILE] user=${userId}`);
        try {
            const profile = await this.memory.profile({ containerTag: userId });
            console.log(`[MEMORY:PROFILE] success user=${userId} duration=${Date.now() - start}ms`);
            return profile;
        } catch (error) {
            console.error(`[MEMORY:PROFILE] failed user=${userId} duration=${Date.now() - start}ms error=${String(error)}`);
            throw error;
        }
    }
}