import { useCallback, useEffect, useState } from "react";
import {
    addSetlistMasterItem,
    createInstrumento,
    subscribeInstrumentos,
    subscribeShow,
    updateSetlistMasterOrder,
} from "../services/showService";
import type { Instrumento, SetlistMasterItem, Show } from "../types";

export function useShowMaster(agrupacionId: string, showId: string) {
    const [show, setShow] = useState<Show | null>(null);
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const reorderObras = useCallback(
        async (items: SetlistMasterItem[]) => {
            await updateSetlistMasterOrder(agrupacionId, showId, items);
        },
        [agrupacionId, showId]
    );
    
    useEffect(() => {
        if (!agrupacionId || !showId) return;

        setLoading(true);
        setErrorMessage("");

        let showLoaded = false;
        let instrumentosLoaded = false;

        const updateLoading = () => {
            setLoading(!(showLoaded && instrumentosLoaded));
        };

        const unsubscribeShow = subscribeShow(
            agrupacionId,
            showId,
            (nextShow) => {
                setShow(nextShow);
                showLoaded = true;
                updateLoading();
            },
            (error) => {
                setErrorMessage(error.message);
                setLoading(false);
            }
        );

        const unsubscribeInstrumentos = subscribeInstrumentos(
            agrupacionId,
            showId,
            (nextInstrumentos) => {
                setInstrumentos(nextInstrumentos);
                instrumentosLoaded = true;
                updateLoading();
            },
            (error) => {
                setErrorMessage(error.message);
                setLoading(false);
            }
        );

        return () => {
            unsubscribeShow();
            unsubscribeInstrumentos();
        };
    }, [agrupacionId, showId]);

    const addInstrumento = useCallback(
        async (nombre: string) => {
            await createInstrumento(agrupacionId, showId, nombre);
        },
        [agrupacionId, showId]
    );

    const addObra = useCallback(
        async (nombre: string) => {
            await addSetlistMasterItem(agrupacionId, showId, nombre);
        },
        [agrupacionId, showId]
    );
    return {
        show,
        instrumentos,
        loading,
        errorMessage,
        addInstrumento,
        addObra,
        reorderObras,
    };
}