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
    fullName: 'Mohammed Ali',
    rollNo: '21CS045',
    department: 'Computer Science & Engineering',
    cgpa: '8.7',
    attendance: '86',
    marks: '412/500',
    activities: '• Coding Club President\n• Hackathon Winner 2023\n• ML Research Assistant'
};

const ProfileContext = createContext<{
    profile: ProfileData;
    setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}>({
    profile: defaultProfile,
    setProfile: () => { },
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfile] = useState<ProfileData>(defaultProfile);
    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);