// src/components/GameBoard.jsx
import React, { useEffect, useState } from "react";
import "./GameBoard.css";


// --- imágenes (usa exactamente los nombres de tus archivos en /src/assets) ---
import img1 from "../assets/20220930_121218.jpg";
import img2 from "../assets/20221025_230141.jpg";
import img3 from "../assets/20230507_044441.jpg";
import img4 from "../assets/20241222_214452.jpg";
import img5 from "../assets/20250522_232721.jpg";
import img6 from "../assets/IMG_20210303_180224.jpg";
import img7 from "../assets/IMG_20210303_180247.jpg";
import img8 from "../assets/IMG_20241211_003304_527.jpg";
import img9 from "../assets/IMG-20201123-WA0000.jpg";
import img10 from "../assets/IMG-20211015-WA0068.jpg";
import img11 from "../assets/IMG-20220321-WA0009.jpg";

import backImg from "../assets/back.jpg";

const allImages = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11,
];

export default function GameBoard() {
  const [cards, setCards] = useState([]);        // { id, img }
  const [flipped, setFlipped] = useState([]);    // indices volteados temporalmente
  const [matched, setMatched] = useState([]);    // indices ya encontrados
  const [level, setLevel] = useState(1);
  const [errors, setErrors] = useState(0);

  const [showWinMessage, setShowWinMessage] = useState(false);
  const [showPrize, setShowPrize] = useState(false);

  // tamaño de cartas (CSS variable)
  const cols = Math.max(1, Math.ceil(Math.sqrt(cards.length || 1)));

  // --- helpers ---
  const shuffleArray = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Barajar según nivel (nivel 1 = 2 pares, nivel 2 = 3 pares, ... nivel N = N+1 pares)
  const shuffleCards = (lvl) => {
    setCards([]); // limpiar para evitar flash de imágenes anteriores
    setFlipped([]);
    setMatched([]);
    setErrors(0);

    const totalPairs = Math.min(lvl + 1, allImages.length);
    const selected = shuffleArray([...allImages]).slice(0, totalPairs);
    const doubled = [...selected, ...selected];
    const shuffled = shuffleArray(doubled).map((img, i) => ({ id: i, img }));

    // pequeño delay para que no se muestre un tablero con imágenes viejas
    setTimeout(() => setCards(shuffled), 200);
  };

  // Inicializar al cambiar de nivel
  useEffect(() => {
    shuffleCards(level);
    // ocultar modales cada vez que cambiamos de nivel
    setShowWinMessage(false);
    setShowPrize(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Detectar fin de nivel (todas las cartas emparejadas)
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      if (level < 10) {
        const t = setTimeout(() => setLevel((p) => p + 1), 1000); // sube 1 nivel después de 1s
        return () => clearTimeout(t);
      } else {
        // nivel 10 completado => mostrar mensaje final
        setTimeout(() => setShowWinMessage(true), 600);
      }
    }
  }, [matched, cards, level]);

  // Manejar la lógica al dar vuelta una carta (índice)
  const handleFlip = (idx) => {
    if (flipped.length === 2) return;
    if (flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      // comparar por URL (importado)
      if (cards[a].img === cards[b].img) {
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
      } else {
        setErrors((e) => e + 1);
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  // Reinicia el mismo nivel (mantiene level)
  const restartLevel = () => {
    shuffleCards(level);
    setShowWinMessage(false);
    setShowPrize(false);
  };

  // Reinicia todo (vuelve al nivel 1)
  const resetGame = () => {
    setLevel(1);
    shuffleCards(1);
    setShowWinMessage(false);
    setShowPrize(false);
    setErrors(0);
  };

  // Coronita: mostrar modal de victoria (siempre visible)
  const handleCrown = () => {
    setShowWinMessage(true);
  };

  return (
   <div className="game-container">

  {/* coronita fija arriba-derecha */}
  <button
    className={`crown ${showWinMessage ? "animate" : ""}`}
    onClick={handleCrown}
    aria-label="Coronita"
  >
    👑
  </button>


      <h1 className="title">Juego de Memoria</h1>
      <h4 className="title2">LLega a nivel 10 para obtener tu Premio</h4>
      <div className="stats">
        <p>Nivel: {level}</p>
        <p>Errores: {errors}</p>
        <div style={{ marginTop: 10 }}>
          <button className="btn" onClick={restartLevel}>🔄 Reiniciar</button>
        </div>
      </div>

      {/* tablero: columnas dinámicas según cantidad de cartas */}
      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${cols}, var(--card-width))` }}
      >
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleFlip(idx)}
            >
              <div className="inner">
  {/* Dorso: visible por defecto */}
  <div className="face front">
    <img src={backImg} alt="back" />
  </div>

  {/* Imagen real: aparece al voltear */}
  <div className="face back">
    <img src={card.img} alt="card" />
  </div>
</div>


            </div>
          );
        })}
      </div>

      {/* Overlay + modal victoria */}
{showWinMessage && (
  <>
    <div className="overlay" onClick={() => setShowWinMessage(false)} />
    <div className="victory-modal surprise">
      <h2>🎉¡Felicidades mi amor, Ganaste!🎉</h2>
      <div className="modal-actions">
        <button className="btn" onClick={resetGame}>🔄 Reiniciar</button>
        <button
          className="btn"
          onClick={() => {
            setShowPrize(true);
            setShowWinMessage(false); // ocultar victoria
          }}
        >
          🎁 Ver Premio
        </button>
      </div>
    </div>

    {/* fuegos artificiales */}
    <div className="fireworks">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="spark"
          style={{
            "--x": `${Math.random() * 400 - 200}px`,
            "--y": `${Math.random() * 400 - 200}px`,
            left: "50%",
            top: "50%"
          }}
        />
      ))}
    </div>
  </>
)}



      {/* Modal premio */}
      {showPrize && (
        <>
          <div className="overlay" onClick={() => setShowPrize(false)} />
          <div className="prize-modal show">
            <button className="close-x" onClick={() => setShowPrize(false)}>✖</button>
            <h3>🎁 Su premio es🎁</h3>
            <p>Una invitacion a festejar el lustro con su monito(el señor Dylan Corigliano Ramos)
              el dia 21/09/2025 a las 20hrs, usted pasara a ser buscada por su domicilio a las 7PM (por favor estar lista
              a horario), no se puede cancelar por enojos dias previos, y tiene que lucir hermosa como siempre.</p>
            {/* Si querés editar el texto desde UI, después lo agregamos */}
          </div>
        </>
      )}
    </div>
  );
}
