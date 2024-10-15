import { Context } from '../app/api/graphql/route';
import jwt from 'jsonwebtoken';
export const resolvers = {
    Query: {
        aImg: async (_parent: any, args: any, context: Context) => {
            if (!context.userId) {
                throw new Error("You are not authenticated.");
            }

            const photos = await context.prisma.photo.findMany({
                where: {
                    ownerId: context.userId,  // Use the `ownerId` directly to filter by user ID
                },
                include: {
                    owner: true,
                },
            });

            return photos;
        },

        allImg: async (_parent: any, _args: any, context: Context) => {
            const photos = await context.prisma.photo.findMany({
                include: {
                    owner: true,  // Ensure owner is included
                },
            });
            return photos;
        },
    },
    Mutation: {
        signup: async (_parent: any, args: any, context: Context) => {
            const user = await context.prisma.user.create({
                data: {
                    name: args.name,
                },
            });
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })
            return token;
        },
        login: async (_parent: any, args: any, context: Context) => {
            const user = await context.prisma.user.findFirst({
                where: {
                    name: args.name
                },
            });
            if (!user) {
                throw new Error("User not found.");
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })
            return token;
        },
        addPhoto: async (_parent: any, args: any, context: Context) => {
            if (!context.userId) {
                throw new Error("You are not authenticated.");
            }
            const photo = await context.prisma.photo.create({
                data: {
                    title: args.title,
                    image: args.image,
                    ownerId: context.userId,
                },
            });
            return "Done addding the img successfully";
        },
        changeTitle: async (_parent: any, args: any, context: Context) => {
            if (!context.userId) {
                throw new Error("You are not authenticated.");
            }
            const photo = await context.prisma.photo.update({
                where: {
                    id: args.id,
                },
                data: {
                    title: args.title,
                },
            });
            return "Image title changed successfully";
        },
        deletePhoto: async (_parent: any, args: any, context: Context) => {
            if (!context.userId) {
                throw new Error("You are not authenticated.");
            }
            if (context.userId !== args.id) {

            }
            const photo1 = await context.prisma.photo.findUnique({
                where: {
                    id: args.id,
                    ownerId: context.userId,
                },
            });
            if (!photo1) {
                return "You are not the owner"
            }
            else {
                await context.prisma.photo.delete({
                    where: {
                        id: args.id,
                    },
                });
            }
            return "Image deleted successfully";
        },
    },
};
