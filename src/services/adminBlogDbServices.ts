import prisma from "./generatePrismaClient";
import { Category } from "@prisma/client";

export default {
  createCategory: (category: string[]) => {
    const categories = Promise.all(
      category.map(async (cat) => {
        return await prisma.category.upsert({
          where: { name: cat },
          update: {},
          create: { name: cat }
        });
      })
    );
    return categories;
  },

  createBlog: (title: string, content: string, headline: string) => {
    return prisma.post.create({
      data: {
        title,
        content,
        headline,
        authorName: "Mayank"
      }
    });
  },

  connectBlogWithCategory: (blogId: number, category: Category[]) => {
    return prisma.post.update({
      where: {
        postId: blogId
      },
      data: {
        categories: {
          create: category.map((catId) => ({
            categoryId: catId.id
          }))
        }
      },
      include: {
        categories: true
      }
    });
  },

  getUserEmails: () => {
    return prisma.user.findMany({
      where: {
        accountConfirmation: {
          isVerified: true
        }
      },
      select: {
        email: true
      }
    });
  },

  findBlogById: (postId: number) => {
    return prisma.post.findUnique({
      where: {
        postId
      }
    });
  },

  updateBlog: (postId: number, title: string, content: string, headline: string, category: Category[]) => {
    return prisma.post.update({
      where: {
        postId
      },
      data: {
        title,
        content,
        headline,
        categories: {
          create: category.map((cat) => ({
            categoryId: cat.id
          }))
        }
      }
    });
  },

  deleteBlog: (postId: number) => {
    return prisma.post.delete({
      where: {
        postId
      }
    });
  }
};
