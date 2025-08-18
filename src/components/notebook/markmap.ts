import { create } from 'zustand';

// 1. Bikin "KTP" atau interface buat state dan action lo
interface MindMapState {
  mindMapData: string;
  isLoadingMindMap: boolean;
  setMindMapData: (data: string) => void;
  setIsLoadingMindMap: (status: boolean) => void;
}

// 2. Pasang "KTP" itu ke 'create' pake <MindMapState>
const useMindMapStore = create<MindMapState>((set) => ({
  // State awal harus sesuai sama "KTP"
  mindMapData: '',
  isLoadingMindMap: false,

  // Action juga harus sesuai
  setMindMapData: (data) => set({ mindMapData: data }),
  setIsLoadingMindMap: (status) => set({ isLoadingMindMap: status }),
}));

export default useMindMapStore;