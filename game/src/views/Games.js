import { useEffect, useState } from "react";
import socket from "../utils/socket";
import handleRequestError from "../utils/handleRequestError";
import Quiz from "../components/games/quiz";
import WordFind from "../components/games/wordfind";
// import axios from "axios";

function Games(props) {
    const { accessToken, setAccessToken } = props
    const [gamePacks, setGamePacks] = useState([])
    const [gameState, setGameState] = useState({})
    const [userResult, setUserResult] = useState({})

    // handle socket authen
    useEffect(() => {
        socket.auth = { token: accessToken }
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [accessToken])

    useEffect(() => {
        socket.on('connect_error', (err) => {
            handleRequestError(err)
            localStorage.setItem('access_token', '')
            setAccessToken('')
        })

        return () => {
            socket.off('connect_error')
        }
    }, [setAccessToken])

    // setup socket events
    useEffect(() => {
        socket.on('game:initGamePacks', setGamePacks)
        socket.on('game:initGameState', setGameState)
        socket.on('game:initResult', setUserResult)

        socket.on('result:update', (data) => {
            console.log(data)
            console.log(setUserResult(data.data))
        })

        return () => {
            socket.off('result:update')
            socket.off('game:initGamePacks')
            socket.off('game:initGameState')
            socket.off('game:initResult')
        }
    }, [])

    const handleAnswer = (answer) => {
        socket.emit('game:answer', answer)
    }

    const currentGamePack = gamePacks[gameState?.currentGamePack]
    const currentQuestion = currentGamePack?.questions[gameState?.currentQuestion]

    console.log(currentGamePack, currentQuestion)

    return (
        <>
            {
                JSON.stringify(userResult)
            }
            {
                currentGamePack && currentQuestion
                    ?
                    <>
                        {
                            currentGamePack.__component === 'game-packs.quiz-packs' &&
                            <Quiz question={currentQuestion} handleAnswer={handleAnswer} />
                        }
                        {
                            currentGamePack.__component === 'game-packs.word-find-packs' &&
                            <WordFind question={currentQuestion} handleAnswer={handleAnswer} />
                        }
                    </>
                    :
                    <div>Loading</div>
            }
        </>
    )
}

export default Games