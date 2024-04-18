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