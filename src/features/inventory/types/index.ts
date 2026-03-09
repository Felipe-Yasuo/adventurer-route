/** Linha de inventário do usuário */
export type InventoryRow = {
    id: string;
    quantity: number;
    item: {
        id: string;
        type: string;
        name: string;
        price: number;
        healValue: number;
    };
};

/** Resposta da API ao usar um item */
export type UseItemResponse = {
    healed: number;
    user: { id: string; life: number; maxLife: number };
    usedItem: { id: string; name: string; healValue: number };
    remaining: number;
};
