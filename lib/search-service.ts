import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { Prisma } from "@prisma/client";

export const getSearch = async (term?: string) => {
  let userId;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  const baseQuery: Prisma.StreamWhereInput = {
    OR: [
      {
        name: {
          contains: term,
          mode: 'insensitive',
        },
      },
      {
        user: {
          username: {
            contains: term,
            mode: 'insensitive',
          },
        },
      },
    ],
  };

  const select: Prisma.StreamSelect = {
    id: true,
    name: true,
    isLive: true,
    thumbnailUrl: true,
    updatedAt: true,
    user: {
      select: {
        id: true,
        username: true,
        imageUrl: true,
      },
    },
  };

  const orderBy: Prisma.StreamOrderByWithRelationInput[] = [
    { isLive: "desc" as Prisma.SortOrder },
    { updatedAt: "desc" as Prisma.SortOrder },
  ];

  try {
    let streams;

    if (userId) {
      streams = await db.stream.findMany({
        where: {
          AND: [
            baseQuery,
            {
              user: {
                blocking: {
                  every: {
                    NOT: {
                      blockedId: userId,
                    },
                  },
                },
              },
            },
          ],
        },
        select,
        orderBy,
      });
    } else {
      streams = await db.stream.findMany({
        where: baseQuery,
        select,
        orderBy,
      });
    }

    return streams;

  } catch (error) {
    console.error("Error in getSearch:", error);
    throw new Error("Failed to perform search");
  }
};