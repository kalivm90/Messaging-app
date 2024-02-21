import NextAuth from "next-auth/next";

export module "next-auth" {
    interface Session {
        user: {
            email: string, 
            id: string,
            image: string,
            username: string,
            name: string,
        }
    }
    interface Profile {
        iss?: string
    }
}