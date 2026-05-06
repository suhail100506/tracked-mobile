import React, { createContext, useState, useContext } from 'react';

export type ProfileData = {
    fullName: string;
    rollNo: string;
    department: string;
    cgpa: string;
    attendance: string;
    marks: string;
    activities: string;
};

const defaultProfile: ProfileData = {
    fullName: '',
    rollNo: '',
    department: '',
    cgpa: '',
    attendance: '',
    marks: '',
    activities: ''
};

const ProfileContext = createContext<{
    profile: ProfileData;
    setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}>({
    profile: defaultProfile,
    setProfile: () => { },
    token: null,
    setToken: () => { },
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfile] = useState<ProfileData>(defaultProfile);
    const [token, setToken] = useState<string | null>(null);
    return (
        <ProfileContext.Provider value={{ profile, setProfile, token, setToken }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);