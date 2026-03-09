/** Item disponível na loja */
export type ShopItem = {
    id: string;
    type: string;
    name: string;
    price: number;
    healValue: number;
};

/** Resposta da API ao comprar um item */
export type BuyItemResponse = {
    user: { id: string; gold: number };
    inventoryItem: {
        id: string;
        quantity: number;
        item: { id: string; name: string };
    };
    totalCost: number;
};
