import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MedicalIdentity {
  id: string;
  name: string;
  bloodGroup: string;
  allergies: string;
  medications: string;
  emergencyContact: string;
  chronicConditions: string;
  pastSurgeries: string;
  recentIssues: string;
  age: string;
  gender: string;
  doctorHospital?: string;
  reports?: Array<{ name: string; type: string; content: string }>;
  image?: string; // Base64 or URL
  faceImageUrl?: string; // Supabase public URL for the face image
  createdAt: string;
  vitals?: {
    heartRate: number;
    bloodPressure: string;
    oxygenLevel: number;
    temperature: number;
  };
}

interface MedicalIdentityContextType {
  identities: MedicalIdentity[];
  activeUser: MedicalIdentity | null;
  registerIdentity: (identity: Partial<MedicalIdentity> & { id: string }) => void;
  findMatch: (imageData?: string) => MedicalIdentity | null;
  setActiveUser: (user: MedicalIdentity | null) => void;
}

const MedicalIdentityContext = createContext<MedicalIdentityContextType | undefined>(undefined);

export const MedicalIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeUser, setActiveUser] = useState<MedicalIdentity | null>(null);
  const [identities, setIdentities] = useState<MedicalIdentity[]>([]);

  // We can optionally fetch existing patients from backend on mount if needed
  // For now, we'll keep it simple for the demo flow

  const registerIdentity = (data: Partial<MedicalIdentity> & { id: string }) => {
    const newIdentity: MedicalIdentity = {
      ...data,
      name: data.name || 'Unknown Patient',
      bloodGroup: data.bloodGroup || 'N/A',
      allergies: data.allergies || 'None',
      medications: data.medications || 'None',
      emergencyContact: data.emergencyContact || 'N/A',
      chronicConditions: data.chronicConditions || 'None',
      pastSurgeries: data.pastSurgeries || 'None',
      recentIssues: data.recentIssues || 'None',
      age: data.age || 'N/A',
      gender: data.gender || 'N/A',
      createdAt: data.createdAt || new Date().toISOString(),
      vitals: data.vitals || {
        heartRate: 70 + Math.floor(Math.random() * 10),
        bloodPressure: '120/80',
        oxygenLevel: 97 + Math.floor(Math.random() * 3),
        temperature: 36.5 + (Math.random() * 0.5)
      }
    } as MedicalIdentity;
    
    setIdentities(prev => [...prev, newIdentity]);
    setActiveUser(newIdentity);
  };

  const findMatch = (): MedicalIdentity | null => {
    // This is now primarily handled by the backend
    // Returning the last registered user as a fallback for components that still use this
    return activeUser || (identities.length > 0 ? identities[identities.length - 1] : null);
  };

  return (
    <MedicalIdentityContext.Provider value={{ identities, activeUser, registerIdentity, findMatch, setActiveUser }}>
      {children}
    </MedicalIdentityContext.Provider>
  );
};

export const useMedicalIdentity = () => {
  const context = useContext(MedicalIdentityContext);
  if (context === undefined) {
    throw new Error('useMedicalIdentity must be used within a MedicalIdentityProvider');
  }
  return context;
};
