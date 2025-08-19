export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    isEmailVerified: boolean;
    profilePicture?: string;

}

export interface Workspace{
    _id: string;
    name: string;
    description?: string;
    owner: User | string;
    color: string;
    members: {
        user: User;
        role: "admin" | "member" | "owner" | "viewer";
        joinedAt: Date;
    }[];
    createdAt: Date;
}