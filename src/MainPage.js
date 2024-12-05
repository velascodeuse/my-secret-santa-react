import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const MainPage = () => {
  const [participants, setParticipants] = useState([]);
  const [participantName, setParticipantName] = useState('');
  const [email, setEmail] = useState('');
  const [inputError, setInputError] = useState('');

  // Ajouter un participant
  const addParticipant = () => {
    if (participantName.trim() === '' || email.trim() === '') {
      setInputError('Veuillez entrer un prénom et une adresse e-mail.');
      return;
    }
    if (participants.some((p) => p.email === email || p.name === participantName)) {
      setInputError('Ce prénom ou cette adresse e-mail est déjà utilisé.');
      return;
    }
    setParticipants([...participants, { name: participantName.trim(), email: email.trim() }]);
    setParticipantName('');
    setEmail('');
    setInputError('');
  };

  // Envoyer l'e-mail via EmailJS
  const sendEmail = (participant, receiver, revealLink) => {
    const templateParams = {
      participant_name: participant.name,
      participant_email: participant.email, // Destinataire de l'email
      receiver_name: receiver.name, // Personne à qui offrir le cadeau
      reveal_link: revealLink, // Lien personnalisé
    };


    // Verifier l'envoi des emails dans la console
    // console.log('Envoi d’e-mail avec les paramètres :', templateParams);

    emailjs
      .send('service_fzjp98h', 'template_g4ho02a', templateParams, 'spWQc5FC8cCT1OLae')
      .then(
        (response) => {
          console.log(`E-mail envoyé avec succès à ${participant.email}`, response.status, response.text);
        },
        (error) => {
          console.error(`Erreur lors de l’envoi de l’e-mail à ${participant.email} :`, error);
        }
      );
  };

  // Lancer le tirage en laissant un délai entre chaque envoi de mail pour éviter la surcharge
  const launchDraw = () => {
    if (participants.length < 2) {
      alert('Veuillez ajouter au moins 2 participants.');
      return;
    }
  
    const shuffled = [...participants];
    let isValid = false;
  
    // Répétez jusqu'à ce que le tirage soit valide (pas de correspondance avec soi-même)
    while (!isValid) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      isValid = shuffled.every((participant, index) => participant.email !== participants[index].email);
    }
  
    // Fonction récursive pour envoyer les e-mails un par un avec un délai
    const sendEmailsSequentially = (index) => {
      if (index >= participants.length) {
        alert('Le tirage est terminé et les e-mails ont été envoyés !');
        return;
      }
  
      const participant = participants[index];
      const receiver = shuffled[index];
      const token = btoa(JSON.stringify({ giver: participant.name, receiver: receiver.name }));
      const revealLink = `${window.location.origin}/reveal?token=${encodeURIComponent(token)}`;

  
      sendEmail(participant, receiver, revealLink);
  
      // Sauvegarder les résultats dans localStorage
      const savedResults = JSON.parse(localStorage.getItem('secretSantaResults')) || [];
      savedResults.push({ token, giver: participant.name, receiver: receiver.name });
      localStorage.setItem('secretSantaResults', JSON.stringify(savedResults));
  
      // Appel récursif avec un délai (par exemple, 2 secondes entre les envois)
      setTimeout(() => sendEmailsSequentially(index + 1), 2000);
    };
  
    // Démarrer l'envoi
    sendEmailsSequentially(0);
  };
  

  // Test d'envoi d'un e-mail
  // const testEmail = () => {
  //   const testParams = {
  //     participant_name: 'Alice',
  //     participant_email: 'votre-adresse-valide@gmail.com',
  //     receiver_name: 'Bob',
  //     reveal_link: 'https://example.com/reveal?token=abc123',
  //   };

  //   emailjs
  //     .send('service_fzjp98h', 'template_g4ho02a', testParams, 'spWQc5FC8cCT1OLae')
  //     .then(
  //       (response) => {
  //         console.log('Test réussi :', response.status, response.text);
  //       },
  //       (error) => {
  //         console.error('Erreur lors du test :', error);
  //       }
  //     );
  // };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Christmas Secret Santa 🎅</h1>
        <div className="input-section">
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Entrez un prénom"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez une adresse e-mail"
          />
          <button onClick={addParticipant}>Ajouter</button>
        </div>
        {inputError && <p className="error">{inputError}</p>}
        <div className="participants">
          <h2>Participants :</h2>
          <ul>
            {participants.map((participant, index) => (
              <li key={index}>
                {participant.name} ({participant.email})
              </li>
            ))}
          </ul>
        </div>
        <button onClick={launchDraw} disabled={participants.length < 2}>
          Lancer le tirage et envoyer les e-mails 🎁
        </button>

        {/* bouton pour tester l'envoi des mail */}
        {/* <button onClick={testEmail}>Envoyer un e-mail de test</button> */}
      </header>
    </div>
  );
};

export default MainPage;
