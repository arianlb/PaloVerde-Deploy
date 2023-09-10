export interface Item {
    price_data: Price_Data;
    quantity: number;
}

export interface Price_Data {
    product_data: Product_Data;
    currency: string;
    unit_amount: number;
}

export interface Product_Data {
    name: string;
    description: string;
}