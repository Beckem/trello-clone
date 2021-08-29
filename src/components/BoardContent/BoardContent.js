import Column from 'components/Column/Column'
import React, { useEffect, useRef, useState } from 'react'
import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { isEmpty } from 'lodash'
import { mapOrder } from 'utilites/sorts'
import { applyDrag } from 'utilites/dragDrop'
import { Container, Draggable } from 'react-smooth-dnd'
import {Container as BootstrapContainer, Row, Col, Form, Button} from 'react-bootstrap'
function BoardContent() {
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
    const newColumnInputRef = useRef(null)
    const [newColumnTitle, setNewColumnTitle] = useState('')
    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
        if (boardFromDB) {
            setBoard(boardFromDB)
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, [])

    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus()
            newColumnInputRef.current.select()
        }
    }, [openNewColumnForm])

    if (isEmpty(board)) {
        return <div className="not-found" style={ { 'padding':'10px', 'color':'white' } } > Board not found </div>
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns]
        newColumns = applyDrag(newColumns, dropResult)

        let newBoard = {...board}
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns
        setColumns(newColumns)
        setBoard(newBoard)
    }

    const onCardDrop = (columnId, dropResult) => {
        if (dropResult.removedIndex != null || dropResult.addedIndex != null) {
            let newColumns = [...columns]

            let currentColumn = newColumns.find(c => c.id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

            setColumns(newColumns)
        }
    }

    const toggleOpenNewColumnForm = () => {
        setOpenNewColumnForm(!openNewColumnForm)
    }

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus()
            return
        }

        const newColumnToAdd = {
            id: Math.random().toString(36).substr(2, 5), 
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards:[]
        }
        let newColumns = [ ...columns ]
        newColumns.push(newColumnToAdd)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns
        setColumns(newColumns)
        setBoard(newBoard)

        setNewColumnTitle('')
        toggleOpenNewColumnForm()
    }
    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index => columns[index]}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
            >
                {columns.map((column, index)=>(
                    <Draggable key={index}>
                        <Column column={column} onCardDrop={onCardDrop}/>
                    </Draggable>
                ))}
            </Container>

            <BootstrapContainer className="add-column-container">
                {!openNewColumnForm ? 
                    (
                        <Row>
                            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
                                <i className="fa fa-plus icon"/> Add another column 
                            </Col>
                        </Row>
                    )
                    :
                    (
                        <Row >
                            <Col className="enter-new-column">
                                <Form.Control 
                                    size="sm" 
                                    type="text" 
                                    placeholder="Enter column title..."
                                    className="input-enter-new-column"
                                    ref={newColumnInputRef}
                                    value={newColumnTitle}
                                    onChange={e => setNewColumnTitle(e.target.value)}
                                    onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                                />
                                <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
                                <span className="cancel-new-column" onClick={toggleOpenNewColumnForm}><i className="fa fa-trash icon"/></span>
                            </Col>
                        </Row>
                    )

                }

            </BootstrapContainer>
        </div>
    )
}

export default BoardContent
