import { useEffect, useState } from "react"
import styles from "./wordfind.module.css"

import WordFindModule from "../../../libs/wordfind/wordfind.ts"

function WordFind(props) {
    const { question, handleAnswer } = props
    const [isSelecting, setIsSelecting] = useState(false)
    const [selected, setSelected] = useState([])
    const [orientation, setOrientation] = useState('')
    const [found, setFound] = useState([])

    const getElementData = (e) => ({
        letter: e.target.innerText,
        x: parseInt(e.target.getAttribute('data-x')),
        y: parseInt(e.target.getAttribute('data-y'))
    })

    const getOrientation = (e) => {
        if (!selected.length) return
        const lastSelected = selected[selected.length - 1]
        const newSelected = getElementData(e)
        if (newSelected.x === lastSelected.x + 1 && newSelected.y === lastSelected.y) return 'horizontal'
        if (newSelected.x === lastSelected.x - 1 && newSelected.y === lastSelected.y) return 'horizontalBack'
        if (newSelected.x === lastSelected.x && newSelected.y === lastSelected.y + 1) return 'vertical'
        if (newSelected.x === lastSelected.x && newSelected.y === lastSelected.y - 1) return 'verticalUp'
        if (newSelected.x === lastSelected.x + 1 && newSelected.y === lastSelected.y + 1) return 'diagonal'
        if (newSelected.x === lastSelected.x - 1 && newSelected.y === lastSelected.y + 1) return 'diagonalBack'
        if (newSelected.x === lastSelected.x + 1 && newSelected.y === lastSelected.y - 1) return 'diagonalUp'
        if (newSelected.x === lastSelected.x - 1 && newSelected.y === lastSelected.y - 1) return 'diagonalUpBack'
        return
    }

    const handleMouseDown = (e) => {
        setIsSelecting(true)
        setSelected([getElementData(e)])
    }

    const handleMouseEnter = (e) => {
        if (!isSelecting) return

        const newSelected = getElementData(e)
        const selectedItemIndex = selected.findIndex(item => item.x === newSelected.x && item.y === newSelected.y)
        if (selectedItemIndex === 0) {
            setOrientation('')
        }
        if (selectedItemIndex >= 0) {
            setSelected(prevState => {
                const updateSelected = [...prevState]
                updateSelected.length = selectedItemIndex + 1
                return updateSelected
            })
        }

        if (orientation && orientation !== getOrientation(e)) return

        setOrientation(getOrientation(e))
        setSelected(prevState => {
            const updateSelected = [...prevState]
            updateSelected.push(getElementData(e))
            return updateSelected
        })
    }

    const clearSelected = () => {
        setIsSelecting(false)
        setOrientation('')
        setSelected([])
    }

    useEffect(() => {
        window.addEventListener('mouseup', clearSelected)

        return () => {
            window.removeEventListener('mouseup', clearSelected)
        }
    }, [])

    // set found words display
    useEffect(() => {
        const wordfind = WordFindModule()

        const foundWordsMap = question.foundWords?.map(foundWord => {
            const [matched] = question.answers?.filter(answer => answer.id === foundWord)
            return matched.text
        })

        if (!foundWordsMap) {
            setFound([])
            return
        }

        const solved = wordfind.solve(question.puzzle, foundWordsMap)
        const foundChars = []
        solved.found.forEach(item => {
            for (let i = 0; i < item.word.length; i++) {
                const itemCloned = {...item}
                if (item.orientation === 'horizontal') itemCloned.x += i
                if (item.orientation === 'horizontalBack') itemCloned.x -= i
                if (item.orientation === 'vertical') itemCloned.y += i
                if (item.orientation === 'verticalUp') itemCloned.y -= i
                if (item.orientation === 'diagonal') {
                    itemCloned.x += i
                    itemCloned.y += i
                }
                if (item.orientation === 'diagonalBack') {
                    itemCloned.x -= i
                    itemCloned.y += i
                }
                if (item.orientation === 'diagonalUp') {
                    itemCloned.x += i
                    itemCloned.y -= i
                }
                if (item.orientation === 'diagonalUpBack') {
                    itemCloned.x -= i
                    itemCloned.y -= i
                }

                foundChars.push(itemCloned)
            }
        })
        setFound(foundChars)
    }, [question.puzzle, question.answers, question.foundWords])

    // handle answer
    useEffect(() => {
        const word = selected.map(item => item.letter).join('')
        const isWordFound = question.answers?.some(answer => answer.text === word)
        if (!isWordFound) return

        clearSelected()
        const [answer] = question.answers?.filter(answer => answer.text === word)
        if (!answer) return
        if (question.foundWords?.includes(answer.id)) return
        handleAnswer(answer.id)

    }, [selected, question.answers, question.foundWords, handleAnswer])

    const renderPuzzle = question?.puzzle.map((cols, y) => {
        const rows = cols.map((row, x) => {
            const isSelected = selected.some(item => item.x === x && item.y === y)
            const isFound = found.some(item => item.x === x && item.y === y)
            return (
                <button
                    key={`${x}_${y}`}
                    data-x={x}
                    data-y={y}
                    className={`${isSelected ? styles.selected : ''} ${isFound ? styles.found : ''} ${styles.char}`}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}>
                    {row}
                </button>
            )
        })
        return <div key={y}>{rows}</div>
    })

    return (
        <>
            {renderPuzzle}
        </>
    )
}

export default WordFind