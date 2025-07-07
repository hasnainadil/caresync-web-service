import '@testing-library/jest-dom';
import React from 'react';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  User: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/' }),
}));

// Mock leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    invalidateSize: jest.fn(),
    getContainer: jest.fn(() => ({})),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
  })),
  icon: jest.fn(() => ({})),
  divIcon: jest.fn(() => ({})),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
      mergeOptions: jest.fn(),
    },
  },
  routing: {
    control: jest.fn(() => ({
      addTo: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    })),
  },
}));

// Mock leaflet-routing-machine
jest.mock('leaflet-routing-machine', () => ({}));

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => React.createElement('div', { 'data-testid': 'map' }, children),
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  Circle: () => null,
  Tooltip: () => null,
  useMap: () => ({
    setView: jest.fn(),
  }),
}));

// Mock ResizeObserver globally for tests (for map and other components)
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
