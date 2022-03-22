import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "/lib/mongodb"

export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
          }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    database: process.env.DB_URL,
    session: { jwt: true },
    secret: process.env.SECRET,
    jwt: { secret: process.env.SECRET },
    callbacks: {
        async redirect() { return process.env.NEXTAUTH_URL },
    },
   
})