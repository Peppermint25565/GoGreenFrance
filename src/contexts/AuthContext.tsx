import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut 
} from "firebase/auth";
import { collection, doc, DocumentData, getDoc, getDocs, query, QuerySnapshot, setDoc, updateDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/firebaseConfig";
import { UploadData, uploadProfilePictures } from '@/supabase';

export type UserRole = 0 | 1 | 2;
export interface UserClient {
  id: string;
  email: string | null;
  name: string;
  role: UserRole;
  avatar?: string;
}
export type KycStatus = 'not_started'|'in_review'|'verified';
export interface UserProvider {
  id: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  name: string;
  email: string;
  phone: string;
  address: string;
  specializations: string[];
  zone: string;
  hourlyRate: number;
  description: string;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  kyc: {
    identity: { url: string, status: KycStatus },
    address:  { url: string, status: KycStatus },
    insurance:{ url: string, status: KycStatus },
    bank:     { url: string, status: KycStatus }
  };
}
interface AuthContextType {
  u: UserClient | UserProvider | null;
  login: (email: string, password: string) => Promise<UserClient | UserProvider>;
  register: (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole, 
    avatarFile?: File | null
  ) => Promise<UserClient | UserProvider>;
  logout: () => Promise<void>;
  loading: boolean;
  changeAvatar: (
    uid: string,
    avatarFile?: File | null
  ) => Promise<void>;
  updateProviderProfile: (
    avatarFile: File,
    profileData: any
  ) => Promise<void>;
  fetchClientDashboard: (
    userId: string
  ) => Promise<QuerySnapshot<DocumentData, DocumentData>>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cached = localStorage.getItem("user");
  const [u, setUser] = useState<UserClient | UserProvider | null>(
    cached && cached != "undefined" ? (JSON.parse(cached)?.role == 0 || JSON.parse(cached)?.role == 2 ? JSON.parse(cached) as UserClient : JSON.parse(cached) as UserProvider) : null
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
          let currentUser: UserClient | UserProvider;
          if (data.role == 0 || data.role == 2) {
            currentUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: data.name,
              role: data.role as UserRole,
              avatar: data.avatar || undefined,
            } as UserClient;
          } else if (data.role == 1) {
            currentUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: data.name,
              role: data.role as UserRole,
              avatar: data.avatar || undefined,
              verified: data.verified,
              phone: data.phone,
              address: data.address,
              specializations: data.specializations,
              zone: data.zone,
              description: data.description,
              availability: {
                monday: data.availability.monday,
                tuesday: data.availability.tuesday,
                wednesday: data.availability.wednesday,
                thursday: data.availability.thursday,
                friday: data.availability.friday,
                saturday: data.availability.saturday,
                sunday: data.availability.sunday,
              },
              kyc: {
                identity: { url: data.kyc.identity.url, status: data.kyc.identity.status },
                address:  { url: data.kyc.address.url, status: data.kyc.address.status },
                insurance:{ url: data.kyc.insurance.url, status: data.kyc.insurance.status },
                bank:     { url: data.kyc.bank.url, status: data.kyc.bank.status }
              }
            } as UserProvider;
          }
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
      let currentUser: UserClient | UserProvider;
      if (data.role == 0 || data.role == 2) {
        currentUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: data.name,
          role: data.role as UserRole,
          avatar: data.avatar || undefined,
        } as UserClient;
      } else if (data.role == 1) {
        currentUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: data.name,
          role: data.role as UserRole,
          avatar: data.avatar || undefined,
          verified: data.verified,
          phone: data.phone,
          address: data.address,
          specializations: data.specializations,
          zone: data.zone,
          description: data.description,
          availability: {
            monday: data.availability.monday,
            tuesday: data.availability.tuesday,
            wednesday: data.availability.wednesday,
            thursday: data.availability.thursday,
            friday: data.availability.friday,
            saturday: data.availability.saturday,
            sunday: data.availability.sunday,
          },
          kyc: {
            identity: { url: data.kyc.identity.url, status: data.kyc.identity.status },
            address:  { url: data.kyc.address.url, status: data.kyc.address.status },
            insurance:{ url: data.kyc.insurance.url, status: data.kyc.insurance.status },
            bank:     { url: data.kyc.bank.url, status: data.kyc.bank.status }
          } 
        } as UserProvider;
      }
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
      return currentUser
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
        photoURL = await uploadProfilePictures(avatarFile, firebaseUser.uid) as string;
      }

      let newUser: UserClient | UserProvider;
      if (role == 0) {
        newUser = {
          email: firebaseUser.email,
          name: name,
          role: role,
          avatar: photoURL,
        } as UserClient;
      } else if (role == 1) {
        newUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: name,
          role: role,
          avatar: photoURL,
          verified: false,
          phone: "",
          address: "",
          specializations: [],
          zone: "",
          description: "",
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
          },
          kyc: {
            identity: { url: "", status: 'not_started' },
            address:  { url: "", status: 'not_started' },
            insurance:{ url: "", status: 'not_started' },
            bank:     { url: "", status: 'not_started' }
          }
        } as UserProvider;
      }

      await setDoc(doc(db, "profiles", firebaseUser.uid), newUser);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser
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

  const updateProviderProfile = async (
    avatarFile: File,
    profileData: any
  ) => {
    if (avatarFile) {
      const storageRef = ref(storage, `avatars/${u.id}`);
      await uploadBytes(storageRef, avatarFile);
      let photoURL = await getDownloadURL(storageRef);
        const dataToSave = {
        ...profileData,
        photoURL,
        updatedAt: Date.now(),
      };
    }
    const dataToSave = {
      ...profileData,
      updatedAt: Date.now(),
    };

    await setDoc(doc(db, 'profiles', u.id), dataToSave, { merge: true });
  }

  const fetchClientDashboard = async (
    userId: string
  ) => {
    const reqQuery = query(
      collection(db, "requests"),
      where("clientId", "==", userId)
    );
    return await getDocs(reqQuery);
  }

  // Fonction de déconnexion
  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ u, login, register, logout, loading, changeAvatar, updateProviderProfile, fetchClientDashboard }}>
      {children}
    </AuthContext.Provider>
  );
};
