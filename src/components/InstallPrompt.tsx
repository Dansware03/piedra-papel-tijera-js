import React, { useState, useEffect } from 'react';

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó la instalación');
        }
        setDeferredPrompt(null);
      });
    }
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <p className="text-lg font-semibold mb-2">¿Quieres instalar la app?</p>
      <p className="mb-4">Instala esta aplicación en tu dispositivo para un acceso rápido y una mejor experiencia.</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowPrompt(false)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          No, gracias
        </button>
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Instalar
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;