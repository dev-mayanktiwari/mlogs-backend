import prisma from "./generatePrismaClient";

export default {
  getBlogsbyIdandCat: (key: string, cat: string[]) => {
    return prisma.post.findMany({
      where: {
        AND: [
          {
            title: {
              contains: key,
              mode: "insensitive"
            }
          },
          {
            categories: {
              some: {
                Category: {
                  name: {
                    in: cat.length ? cat : undefined
                  }
                }
              }
            }
          }
        ]
      }
    });
  }
};

