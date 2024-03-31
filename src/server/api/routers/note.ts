import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(
      z.object({ id: z.string() }),
    )
    .mutation(({ ctx, input }) => {
      const { id } = input;
      return ctx.db.note.delete({
        where: {
            id,
        }
      });
    }),
  create: protectedProcedure
    .input(
      z.object({ title: z.string(), content: z.string(), topicId: z.string() }),
    )
    .mutation(({ ctx, input }) => {
      const { title, content, topicId } = input;
      return ctx.db.note.create({
        data: {
          title,
          content,
          topicId,
        },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(({ ctx, input }) => {
      const { topicId } = input;
      return ctx.db.note.findMany({
        where: {
          topicId,
        },
      });
    }),
});
