import Card from 'components/Card/Card'
import React from 'react'
import './Column.scss'
import { Container, Draggable } from 'react-smooth-dnd'
import {mapOrder} from 'utilites/sorts'
function Column({column}) {
    const cards=mapOrder(column.cards, column.cardOrder, 'id');

    const onCardDrop = (dropResult) => {
        console.log(dropResult);
    }

    return (
        <div className="column">
            <header className="column-drag-handle">{column.title}</header>
            <div className="card-list">
                <Container
                    groupName="col"
                    onDrop={onCardDrop}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            <Card card={card}/>
                        </Draggable>
                    ))}
                </Container>
            </div>
            <footer>Add another card</footer>
            </div>
    )
}

export default Column
