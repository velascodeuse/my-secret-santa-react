import React, { useEffect, useState } from 'react';
import './RevealPage.css';

const generateSnowflakes = () => {
  const snowflakes = [];
  for (let i = 0; i < 50; i++) { // Générer 50 flocons
    const style = {
      left: `${Math.random() * 100}vw`, // Position horizontale aléatoire
      animationDuration: `${Math.random() * 3 + 2}s`, // Durée entre 2 et 5 secondes
      animationDelay: `${Math.random() * 5}s`, // Délais aléatoires
      width: `${Math.random() * 5 + 5}px`, // Taille entre 5px et 10px
      height: `${Math.random() * 5 + 5}px`,
    };
    snowflakes.push(
      <div className="snowflake" key={i} style={style}></div>
    );
  }
  return snowflakes;
};

const RevealPage = () => {
  const [receiverName, setReceiverName] = useState('');
  const [error, setError] = useState('');
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      try {
        // Décoder le token avec decodeURIComponent pour éviter les erreurs dues aux caractères spéciaux
        const data = JSON.parse(atob(decodeURIComponent(token)));
        console.log('Token décodé avec succès :', data); // Debug : Voir le contenu du token dans la console
        setReceiverName(data.receiver);

        // Afficher le nom après un délai
        setTimeout(() => {
          setShowName(true);
        }, 2000); // Délai de 2 secondes
      } catch (err) {
        console.error('Erreur lors du décodage du token :', err);
        setError('Lien invalide ou expiré.');
      }
    } else {
      setError('Aucun lien valide fourni.');
    }
  }, []);

  return (
    <div className="reveal-page">
      {generateSnowflakes()} {/* Affiche les flocons */}
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h1>🎄 Votre Secret Santa 🎁</h1>
          {showName && <p>{receiverName}</p>} {/* Affiche le nom après 2 secondes */}
        </div>
      )}
      <div className="mountains"></div> {/* Affiche les montagnes */}
    </div>
  );
};

export default RevealPage;
