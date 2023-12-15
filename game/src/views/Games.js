import { useEffect, useState } from "react";
import socket from "../utils/socket";
import handleRequestError from "../utils/handleRequestError";
import Quiz from "../components/games/quiz";
import WordFind from "../components/games/wordfind";
import Leaderboard from "../components/games/leaderboard";
import GameState from "../components/games/state";
// import axios from "axios";

function Games(props) {
    const { accessToken, setAccessToken } = props
    const [gamePacks, setGamePacks] = useState([])
    const [gameState, setGameState] = useState({})
    const [userResult, setUserResult] = useState({})
    const [leaderboard, setLeaderboard] = useState([])

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
        socket.on('connect', () => {
            socket.emit('user:connection')
        })
        socket.on('game:updateGamePacks', setGamePacks)
        socket.on('game:updateGameState', setGameState)
        socket.on('game:updateResult', setUserResult)
        socket.on('game:updateLeaderboard', setLeaderboard)

        socket.on('game:userJoined', () => {
            socket.emit('game:getLeaderboard')
        })

        socket.on('contest-setting:update', () => {
            socket.emit('game:getGameState')
            socket.emit('game:getGamePacks')
        })

        socket.on('result:update', (data) => {
            socket.emit('game:getLeaderboard')
            socket.emit('game:getGamePacks')
            
            if (userResult.id !== data.data?.id) return
            const userResultMap = {
                id: data.data.id,
                ...data.data.attributes
            }
            setUserResult(userResultMap)
        })

        socket.on('socket:error', handleRequestError)

        return () => {
            socket.off('connect')
            socket.off('game:updateGamePacks')
            socket.off('game:updateGameState')
            socket.off('game:updateResult')
            socket.off('game:updateLeaderboard')
            socket.off('game:userJoined')
            socket.off('contest-setting:update')
            socket.off('result:update')
            socket.off('socket:error')
        }
    }, [userResult])

    const handleAnswer = (answer) => {
        socket.emit('game:answer', answer)
    }

    const currentGamePack = gamePacks[gameState?.currentGamePack]
    const currentQuestion = currentGamePack?.questions?.[gameState?.currentQuestion]

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-4 order-2 order-lg-1">
                    <Leaderboard leaderboard={leaderboard} />
                </div>
                <div className="col-lg-8 order-1 order-lg-2">
                    <GameState currentGamePack={currentGamePack} gameState={gameState} userResult={userResult} />
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
                </div>
            </div>
        </div>
    )
}

export default Games