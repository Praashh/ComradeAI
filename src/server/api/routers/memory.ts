import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { Memory } from "@/lib/memory";

const memoryInstance = Memory.getInstance();


export const memoryRouter = createTRPCRouter({
    saveMemory: protectedProcedure.input(z.object({ journalText: z.string() })).mutation(async ({ input, ctx }) => {
        const { journalText } = input;
        const userId = ctx.session.userId;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        try {
            const result = await memoryInstance.saveInMemory(journalText, userId)
            if (result) {
                console.log(result)
                return { success: true }
            }
            else {
                throw new Error("Failed to save memory");
            }
        }
        catch (error) {
            console.log(`[MEMORY]: ${journalText} failed to save in memory: ${String(error)}`);
            return { success: false }
        }
    }),

    recallMemory: protectedProcedure.input(z.object({ journalText: z.string() })).query(async ({ input, ctx }) => {
        const { journalText } = input;
        const userId = ctx.session.userId;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        try {
            const result = await memoryInstance.recallMemory(journalText, userId)
            if (result) {
                return { success: true, memory: result }
            }
            else {
                throw new Error("Failed to recall memory");
            }
        }
        catch (error) {
            console.log(`[MEMORY]: ${journalText} failed to recall from memory: ${String(error)}`);
            return { success: false }
        }
    })
})
