import {
  collection, doc, addDoc, setDoc, getDoc, getDocs, query,
  where, updateDoc, deleteDoc, writeBatch
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebaseConfig";
import { Request, PriceAdjustment } from "@/types/requests";

/* ---------  Utilitaire upload photos  --------- */
async function uploadFiles(
  folder: string,
  requestId: string,
  files: File[]
): Promise<string[]> {
  if (!files?.length) return [];
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const fileRef = ref(storage, `${folder}/${requestId}/${crypto.randomUUID()}.${ext}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    urls.push(url);
  }
  return urls;
}

/* ---------  1. Création d’une demande  --------- */
export async function createRequest(
  clientId: string,
  data: Omit<Request, "id" | "clientId" | "status" | "providerId" | "priceFinal" | "createdAt">,
  photosFiles: File[]
): Promise<string> {
  // upload éventuelles photos
  const photos = await uploadFiles("requests", clientId, photosFiles);

  const docRef = await addDoc(collection(db, "requests"), {
    ...data,
    clientId,
    photos,
    priceFinal: data.priceOriginal,   // temporaire == estimation initiale
    status: "open",
    createdAt: Date.now(),
  } satisfies Omit<Request, "id">);

  return docRef.id;
}

/* ---------  2. Proposition d’ajustement  --------- */
export async function proposeAdjustment(
  requestId: string,
  providerId: string,
  clientId: string,
  newPrice: number,
  justification: string,
  photosFiles: File[]
) {
  // 2.a – empêcher le doublon
  const q = query(
    collection(db, "adjustments"),
    where("requestId", "==", requestId),
    where("providerId", "==", providerId),
    where("status", "==", "pending")
  );
  const pending = await getDocs(q);
  if (!pending.empty) throw new Error("Ajustement déjà en attente.");

  // 2.b – upload photos
  const photos = await uploadFiles("adjustments", requestId, photosFiles);

  await addDoc(collection(db, "adjustments"), {
    requestId,
    providerId,
    clientId,
    newPrice,
    justification,
    photos,
    status: "pending",
    createdAt: Date.now(),
  } satisfies Omit<PriceAdjustment, "id">);
}

/* ---------  3. Client accepte une offre  --------- */
// - Si adjustmentId est fourni => client accepte la contre-offre
// - Sinon => provider a accepté l’offre initiale
export async function acceptOffer(
  requestId: string,
  providerId: string,
  priceFinal: number,
  adjustmentId?: string
) {
  const batch = writeBatch(db);

  // 3.a – maj de la demande
  const reqRef = doc(db, "requests", requestId);
  batch.update(reqRef, {
    status: "accepted",
    providerId,
    priceFinal,
  });

  // 3.b – statuts d’ajustements
  const adjRefAccepted =
    adjustmentId ? doc(db, "adjustments", adjustmentId) : null;

  // toutes les propositions liées
  const q = query(collection(db, "adjustments"), where("requestId", "==", requestId));
  const snap = await getDocs(q);
  snap.forEach((d) => {
    if (d.id === adjustmentId) {
      // marquer celle acceptée
      batch.update(d.ref, { status: "accepted" });
    } else {
      // supprimer ou marquer obsolète
      batch.delete(d.ref);
    }
  });

  await batch.commit();
}

/* ---------  4. Client refuse une contre-offre  --------- */
export async function rejectAdjustment(
  adjustmentId: string,
  reason: string
) {
  const adjRef = doc(db, "adjustments", adjustmentId);
  await updateDoc(adjRef, {
    status: "rejected",
    reason,
  });
}
