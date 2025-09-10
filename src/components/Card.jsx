import React from "react";
import "./Card.css";
import backImage from "../assets/back.jpg";

export default function Card({ card, onClick }) {
  const isFlipped = card.flipped || card.matched;

  return (
    <button
      type="button"
      className={`memory-card ${isFlipped ? "is-flipped" : ""}`}
      onClick={() => !card.disabled && !card.matched && onClick(card)}
      disabled={card.disabled || card.matched}
      aria-label="card"
    >
      <div className="memory-card-inner">
        {/* cara oculta (dorso) */}
        <div className="memory-card-face memory-card-back">
          <img src={backImage} alt="back" />
        </div>

        {/* cara visible (frente) */}
        <div className="memory-card-face memory-card-front">
          <img src={card.img} alt="card" />
        </div>
      </div>
    </button>
  );
}
