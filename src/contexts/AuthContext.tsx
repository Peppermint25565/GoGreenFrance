import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/firebaseConfig";  // Ajuster le chemin si besoin

export type UserRole = 0 | 1 | 2;
export interface User {
  id: string;
  email: string | null;
  name: string;
  role: UserRole;
  avatar?: string;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole, 
    avatarFile?: File | null
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  changeAvatar: (
    uid: string,
    avatarFile?: File | null
  ) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cached = localStorage.getItem("user");
  const [user, setUser] = useState<User | null>(
    cached ? JSON.parse(cached) : null
  );
  const [loading, setLoading] = useState(true);

  // Surveille les changements d'auth (connexion / déconnexion)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Récupérer le profil Firestore
        const docRef = doc(db, "profiles", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const currentUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: data.name,
            role: data.role as UserRole,
            avatar: data.avatar || undefined,
          };
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Authentification Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      // Récupération du profil Firestore
      const docRef = doc(db, "profiles", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Profil introuvable.");
      const data = docSnap.data();
      const currentUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: data.name,
        role: data.role as UserRole,
        avatar: data.avatar || undefined,
      };
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      console.error("Erreur login :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    avatarFile?: File | null
  ) => {
    setLoading(true);
    try {
      // Création de l'utilisateur Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      let photoURL: string = "";

      // Upload de l'avatar si fourni
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const fileRef = ref(storage, `avatars/${firebaseUser.uid}.${ext}`);
        await uploadBytes(fileRef, avatarFile);
        photoURL = await getDownloadURL(fileRef);
      }

      // Création du profil dans Firestore
      await setDoc(doc(db, "profiles", firebaseUser.uid), {
        name: name,
        email: email,
        role: role,
        avatar: photoURL,
      });

      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: name,
        role: role,
        avatar: photoURL,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Erreur inscription :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changeAvatar = async (
    uid: string,
    avatarFile?: File | null
  ) => {
    setLoading(true);
    try {
      let photoURL: string = "";

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const fileRef = ref(storage, `avatars/${uid}.${ext}`);
        await uploadBytes(fileRef, avatarFile);
        photoURL = await getDownloadURL(fileRef);
      }

      await updateDoc(
        doc(db, "profiles", uid),
        { avatar: photoURL }
);
    } catch (error) {
      console.error("Erreur inscription :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, changeAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
