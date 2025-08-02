import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, 
  sendEmailVerification
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
    identity: { url: string, status: KycStatus, reason?: string },
    address:  { url: string, status: KycStatus, reason?: string },
    insurance:{ url: string, status: KycStatus, reason?: string },
    bank:     { url: string, status: KycStatus, reason?: string }
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
  fetchClientDashboard: (
    userId: string
  ) => Promise<QuerySnapshot<DocumentData, DocumentData>>;
  updateUserData: () => Promise<void>;
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
                identity: { url: data.kyc.identity.url, status: data.kyc.identity.status, ...(data.kyc.identity.reason !== undefined && { reason: data.kyc.identity.reason }) },
                address:  { url: data.kyc.address.url, status: data.kyc.address.status, ...(data.kyc.address.reason !== undefined && { reason: data.kyc.address.reason }) },
                insurance:{ url: data.kyc.insurance.url, status: data.kyc.insurance.status, ...(data.kyc.insurance.reason !== undefined && { reason: data.kyc.insurance.reason }) },
                bank:     { url: data.kyc.bank.url, status: data.kyc.bank.status, ...(data.kyc.bank.reason !== undefined && { reason: data.kyc.bank.reason }) }
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
                identity: { url: data.kyc.identity.url, status: data.kyc.identity.status, ...(data.kyc.identity.reason !== undefined && { reason: data.kyc.identity.reason }) },
                address:  { url: data.kyc.address.url, status: data.kyc.address.status, ...(data.kyc.address.reason !== undefined && { reason: data.kyc.address.reason }) },
                insurance:{ url: data.kyc.insurance.url, status: data.kyc.insurance.status, ...(data.kyc.insurance.reason !== undefined && { reason: data.kyc.insurance.reason }) },
                bank:     { url: data.kyc.bank.url, status: data.kyc.bank.status, ...(data.kyc.bank.reason !== undefined && { reason: data.kyc.bank.reason }) }
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

  const updateUserData = async () => {
    try {
      const docRef = doc(db, "profiles", u.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Profil introuvable.");
      const data = docSnap.data();
      let currentUser: UserClient | UserProvider;
      if (data.role == 0 || data.role == 2) {
        currentUser = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          avatar: data.avatar || undefined,
        } as UserClient;
      } else if (data.role == 1) {
        currentUser = {
          id: data.id,
          email: data.email,
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
                identity: { url: data.kyc.identity.url, status: data.kyc.identity.status, ...(data.kyc.identity.reason !== undefined && { reason: data.kyc.identity.reason }) },
                address:  { url: data.kyc.address.url, status: data.kyc.address.status, ...(data.kyc.address.reason !== undefined && { reason: data.kyc.address.reason }) },
                insurance:{ url: data.kyc.insurance.url, status: data.kyc.insurance.status, ...(data.kyc.insurance.reason !== undefined && { reason: data.kyc.insurance.reason }) },
                bank:     { url: data.kyc.bank.url, status: data.kyc.bank.status, ...(data.kyc.bank.reason !== undefined && { reason: data.kyc.bank.reason }) }
              }
        } as UserProvider;
      }
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      console.error("Erreur login :", error);
      throw error;
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
          id: firebaseUser.uid,
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
      await sendEmailVerification(firebaseUser);
      return newUser
    } catch (error) {
      console.error("Erreur inscription :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchClientDashboard = async (
    userId: string
  ) => {
    const reqQuery = query(
      collection(db, "requests"),
      where("clientId", "==", userId)
    );
    return await getDocs(reqQuery);
  }

  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ u, login, register, logout, loading, fetchClientDashboard, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
