import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrgChartStore = create(
  persist(
    (set) => ({
      /** @type {OrgPerson} */
      orgPerson: null,
      setOrgPerson: (person) => set({ orgPerson: person }),
      selectedPersonId: null,
      setSelectedPersonId: (personId) => set({ selectedPersonId: personId }),
      highlightedNodeId: null,
      setHighlightedNodeId: (nodeId) => set({ highlightedNodeId: nodeId }),
      menuOpenNodeId: null,
      setMenuOpenNodeId: (nodeId) => set({ menuOpenNodeId: nodeId }),
      closeButtonCallbackUrl: null,
      setCloseButtonCallbackUrl: (url) => set({ closeButtonCallbackUrl: url })
    }),
    {
      name: 'org-chart-store',
      partialize: (state) => ({
        closeButtonCallbackUrl: state.closeButtonCallbackUrl
      })
    }
  )
);
