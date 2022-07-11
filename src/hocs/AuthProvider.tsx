import firebaseAuth from "../util/FirebaseServices/auth";
import { signOut } from "firebase/auth";
import { User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getAccountData, AccountData } from "../util/GetRequests";

interface CustomUser extends User {
  teacher: number | null;
  student: number | null;
  account: AccountData;
}

const AuthContext = createContext<{ user: CustomUser | null, handleSignOut: () => void }>({
  user: null,
  handleSignOut: () => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
      } else {
        getAccountData(user.uid).then(account => {
          if (account.teacher) {
            setUser({ ...user, teacher: account.teacher.teacherId, student: null, account });
          }
          else if (account.student) {
            setUser({ ...user, teacher: null, student: account.student.studentId, account });
          }
        })
      }
    });
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseAuth.currentUser;
      if (user) await user.getIdToken(true);
    }, 20 * 60 * 1000);

    return () => clearInterval(handle);
  }, []);

  const handleSignOut = () => signOut(firebaseAuth);

  return (
    <AuthContext.Provider value={{ user, handleSignOut }}>{children}</AuthContext.Provider>
  );
}