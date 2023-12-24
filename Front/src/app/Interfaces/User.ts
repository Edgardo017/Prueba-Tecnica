export interface User {
    id?: number;
    username: string;
    password: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    dni?: string | null;
    phone?: string | null;
    address?: string | null;
    district?: string | null;
    city?: string | null;
    country?: string | null;
    profileImage?: string | null; // Imagen de perfil en formato base64 (string)
    bannerImage?: string | null; // Imagen del banner en formato base64 (string)
}
