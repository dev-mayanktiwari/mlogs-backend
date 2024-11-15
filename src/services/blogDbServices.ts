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
      },
      select: {
        postId: true,
        title: true,
        content: true,
        headline: true,
        authorName: true,
        createdAt: true,
        categories: {
          select: {
            Category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
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

  unlikeBlogbyId: (userId: string, blogId: number) => {
    return prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId: Number(blogId)
        }
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
  },

  getTotalLikes: (blogId: number) => {
    return prisma.like.count({
      where: {
        postId: Number(blogId)
      }
    });
  },

  checkBlogAlreadyCommented: (userId: string, blogId: number) => {
    return prisma.comment.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: blogId
        }
      }
    });
  },

  commentBlogbyId: (userId: string, blogId: number, text: string) => {
    return prisma.comment.create({
      data: {
        userId,
        postId: blogId,
        text
      }
    });
  },

  uncommentBlogbyId: (userId: string, commentId: number) => {
    return prisma.comment.delete({
      where: {
        userId,
        commentId
      }
    });
  },

  getTotalComments: (blogId: number) => {
    return prisma.comment.count({
      where: {
        postId: Number(blogId)
      }
    });
  },

  editComment: (commentId: number, text: string) => {
    return prisma.comment.update({
      where: {
        commentId
      },
      data: {
        text
      }
    });
  },

  checkBlogAlreadySaved: (userId: string, blogId: number) => {
    return prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: blogId
        }
      }
    });
  },

  saveBlogbyId: (userId: string, blogId: number) => {
    return prisma.savedPost.create({
      data: {
        userId,
        postId: blogId
      }
    });
  },

  unsaveBlogbyId: (userId: string, blogId: number) => {
    return prisma.savedPost.delete({
      where: {
        userId_postId: {
          userId,
          postId: Number(blogId)
        }
      }
    });
  },

  getTotalSaves: (blogId: number) => {
    return prisma.savedPost.count({
      where: {
        postId: Number(blogId)
      }
    });
  },

  getComments: (blogId: number) => {
    return prisma.comment.findMany({
      where: {
        postId: Number(blogId)
      }
    });
  },

  findCommentbyId: (userId: string, commentId: number) => {
    return prisma.comment.findUnique({
      where: {
        userId: userId,
        commentId: commentId
      }
    });
  }
};
