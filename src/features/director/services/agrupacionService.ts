import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
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

type UpdateAgrupacionParams = {
    nombre: string;
}

export async function updateAgrupacion(
    id: string,
    { nombre }: UpdateAgrupacionParams
): Promise<void> {
    const nombreNormalizado = nombre.trim();

    if (!nombreNormalizado) {
        throw new Error("El nombre de la agrupación es obligatorio.");
    }

    const docRef = doc(db, "agrupaciones", id);

    await updateDoc(docRef, { nombre: nombreNormalizado });
}

export async function softDeleteAgrupaciones(ids: string[]): Promise<void> {
    await Promise.all(
        ids.map((id) => updateDoc(doc(db, "agrupaciones", id), { active: false }))
    );
}