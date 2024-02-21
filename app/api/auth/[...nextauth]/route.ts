import NextAuth, {Session} from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

// import User from "@/models/user";
import { connectToDB } from "@/util/database";
import {User, MongoInit} from "@/node_modules/messaging-models/src/index"


const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""  
        })
    ],

    callbacks: {
        async session({session}:{session: Session}) {
            if (session?.user) {

                const sessionUser = await User.findOne({
                    email: session.user?.email
                })
                
                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                }   
            }

            return session;
        },

        async signIn({profile}) {
            try {
                // Connect to db
                // await connectToDB();
                await new MongoInit(process.env.MONGODB_URI ?? "", "SockMessage")
                
                // Try and find existing user in the database
                const userExists = await User.findOne({
                    email: profile?.email
                })

                // If user does not exist, create one
                if (!userExists) {
                    await User.create({
                        email: profile?.email,
                        username: profile?.name,
                        provider: profile?.iss,
                    }) 
                }

                return true
            } catch(error) {
                console.log(`Next Auth Route.ts Error: ${error}`);
                return false;
            }
        }
    }
})

export {handler as GET, handler as POST}