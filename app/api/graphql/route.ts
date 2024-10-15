import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../prisma/db';
import { typeDefs } from '../../../graphql/schema';
import { resolvers } from "../../../graphql/resolver";

export type Context = {
    prisma: PrismaClient;
    userId?: string | null;  // Add userId to the context
};

const apolloserver = new ApolloServer<Context>({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler(apolloserver, {
    context: async (req: NextRequest) => {
        const authHeader = req.headers.get('authorization');
        let userId = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            try {
                const decoded: { id: string } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
                userId = decoded.id;  // Extract the userId from the token
            } catch (error) {
                console.error("JWT verification failed:", error);
            }
        }

        return { prisma, userId };  // Pass userId in the context
    },
});

export async function POST(req: NextRequest) {
    return handler(req);
}

export async function GET(req: NextRequest) {
    return handler(req);
}
