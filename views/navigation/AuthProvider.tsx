import { ReactNode, createContext, useState } from "react";

type User = {
    name: string;
    email: string;
}

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { }
});



type AuthProviderProps = {
    children: ReactNode,
}


export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    console.log('AuthProvider user:', user);

    return <AuthContext.Provider
        value={{
            user,
            setUser
        }}>{children}</AuthContext.Provider>
}