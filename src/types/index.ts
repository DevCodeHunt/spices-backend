export type TImage = {
    id: string;
    url: string
}

export type Address = {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
}

export type AddBanner = {
    title: string;
    description: string;
    link: string;
    image: {
        id: string;
        url: string;
    }
}

export type EditBanner = {
    title: string;
    description: string;
    link: string;
    image: {
        id: string;
        url: string;
    },
    imageId: string
}

export type SignUpInput = {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
    acceptTerms: boolean
    subscribed: boolean
}

export type SignInInput = {
    email: string;
    password: string;

}


export type AuthPayload = {
    id: string;
    email: string;
    role: string | string[];
}

export type TokenPair = {
    access_token: string;
    refresh_token: string;
};

export interface AddProduct {
    images: TImage[];
    name: string;
    price: number;
    description: string;
    category: string;
    discountPrice: number;
    discountPercentage: number;
    discountType: string;
    discountStartDate: Date;
    discountEndDate: Date;
    stock: number;
    shippingPrice: number;
    barCode: string;
    sku: string;
    
}

export interface AdminProduct {
    _id: string;
    name: string;
    image: string;
    stock: number;
    price: number;
    salesPerDay: number;
    salesPerMonth: number;
    totalSales: number;
    createdAt: Date;
    updatedAt: Date;
    revenue: number;
    purchased: number;
    rating:{
        count: number;
        average: number;
    },
    purchasedAt: Date;
    category: string
}