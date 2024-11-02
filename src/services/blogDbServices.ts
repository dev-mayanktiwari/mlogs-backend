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
  },

  findBlogbyId: (id: number) => {
    return prisma.post.findUnique({
      where: {
        postId: id
      }
    });
  },

  likeBlogbyId: (userId: string, blogId: number) => {
    return prisma.like.create({
      data: {
        userId,
        postId: blogId
      }
    });
  },

  checkBlogAlreadyLiked: (userId: string, blogId: number) => {
    return prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: blogId
        }
      }
    });
  }
};

