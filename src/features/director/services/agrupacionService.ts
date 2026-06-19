import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";

import { db } from "../../../services/firebase";
import type { Agrupacion } from "../types";

type CreateAgrupacionParams = {
    nombre: string;
    directorId: string;
}

export async function createAgrupacion({
    nombre,
    directorId,
}: CreateAgrupacionParams): Promise<Agrupacion> {
    const nombreNormalizado = nombre.trim();

    if (!nombreNormalizado){
        throw new Error("El nombre de la agrupación es obligatorio.");
    }

    const docRef = doc(collection(db, "agrupaciones"));

    const nuevaAgrupacion: Agrupacion = {
        id: docRef.id,
        nombre: nombreNormalizado,
        directorId,
        active: true,
    };

    await setDoc(docRef, nuevaAgrupacion);

    return nuevaAgrupacion;
}

export async function getAgrupacionesByDirector(
    directorId: string
): Promise<Agrupacion[]> {
    const agrupacionesRef = collection(db, "agrupaciones");

    const q = query(
        agrupacionesRef,
        where("directorId", "==", directorId),
        where("active", "==", true)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data() as Agrupacion);
}