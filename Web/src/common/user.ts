// src/types.ts

export interface FamilyMember {
    name: string;
    seatPreference: string;
}

export interface IUser {
    rName: string;
    email: string;
    dob: string;
    phone: string;
    password: string;
    confirmPassword: string;
    pic: string;
    familyMembers: FamilyMember[];
}
