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
        try {
            const result = await this.memory.add({
                content: journalText,
                containerTag: userId
            });
            console.log(`[MEMORY]: ${journalText} saved in memory`)
            return result;
        }
        catch (error) {
            console.error(`[MEMORY]: Error saving ${journalText} in memory: ${String(error)}`);
            throw error;
        }
    }

    async recallMemory(journalText: string, userId: string) {
        try {
            const result = await this.memory.search.documents({
                q: journalText,
                containerTags: [userId]
            });
            console.log(`[MEMORY]: ${journalText} recalled from memory`)
            return result;
        }
        catch (error) {
            console.error(`[MEMORY]: Error recalling ${journalText} from memory: ${String(error)}`);
            throw error;
        }
    }

    async getUserProfile(userId: string) {
        try {
            const profile = await this.memory.profile({ containerTag: userId });
            console.log(`[MEMORY]: User profile for ${userId} fetched successfully`)
            console.log(profile)
            return profile
        } catch (error) {
            console.log(`[MEMORY]: Error fetching user profile for ${userId}: ${String(error)}`);
            throw error;
        }
    }
}