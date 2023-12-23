export interface User {
    id?: number;
    username: string;
    password: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    dni?: string | null;
    phone?: string | null;
    address?: string | null;
    district?: string | null;
    city?: string | null;
    country?: string | null;
    profileImage?: ArrayBuffer | null;
    bannerImage?: ArrayBuffer | null;
}
