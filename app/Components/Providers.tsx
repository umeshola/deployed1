'use client'
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    // Create an http link to the GraphQL API
    const httpLink = createHttpLink({
        uri: "https://deployed1.vercel.app/api/graphql", // Your GraphQL API endpoint
    });

    // Create a context link to add the Authorization header
    const authLink = setContext((_, { headers }) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        // Return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "", // Set the Authorization header
            },
        };
    });

    // Create Apollo Client with the combined links
    const client = new ApolloClient({
        link: authLink.concat(httpLink), // Combine authLink with httpLink
        cache: new InMemoryCache(),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
