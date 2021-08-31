import React from 'react'
import './Card.scss'

function Card({ card }) {
    return (
        <div className="card-item">
            {card.cover &&
                <img
                    src={card.cover}
                    alt=""
                    className="card-cover"
                    onMouseDown={e => e.preventDefault()}
                />
            }
            {card.title}
        </div>
    )
}

export default Card
