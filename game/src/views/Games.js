import { useEffect, useState } from "react";
import socket from "../utils/socket";
import handleRequestError from "../utils/handleRequestError";
import Quiz from "../components/games/quiz";
import WordFind from "../components/games/wordfind";
import Leaderboard from "../components/leaderboard";
import GameState from "../components/state";
import Waiting from "./Waiting";
import Logo from "./Logo";
import Top3 from "./Top3";
import Leaderboards from "./Leaderboards";
import Matching from "../components/games/matching";
import { toast } from "react-toastify";
// import axios from "axios";

function Games(props) {
    const { accessToken, setAccessToken } = props
    const [gamePacks, setGamePacks] = useState([])
    const [gameState, setGameState] = useState({})
    const [userResult, setUserResult] = useState({})
    const [leaderboard, setLeaderboard] = useState([])
    const [showTop3, setShowTop3] = useState(true)

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
        // skip if time's up
        if (gameState?.currentTimeLeft <= 0) {
            toast.error(`Time's up`, { theme: 'colored' })
            return
        }

        socket.emit('game:answer', answer)
    }

    const currentGamePack = gamePacks[gameState?.currentGamePack]
    const currentQuestion = currentGamePack?.questions?.[gameState?.currentQuestion]

    const hideLeaderBoardGames = []
    const isShowLeaderBoard = !hideLeaderBoardGames.includes(currentGamePack?.__component) || gameState?.currentTimeLeft <= 0

    return (
        <div className="container">
            <div className="row">
                {
                    gameState?.currentStatus === 'ended'
                        ?
                        showTop3 ? <Top3 leaderboard={leaderboard} setShowTop3={setShowTop3} /> : <Leaderboards leaderboard={leaderboard} setShowTop3={setShowTop3} />
                        :
                        !gameState?.currentStatus || gameState?.currentStatus === 'waiting' || gameState?.currentStatus === 'paused'
                            ?
                            <Waiting gameState={gameState} currentGamePack={currentGamePack} leaderboard={leaderboard} />
                            :
                            <>
                                <div className="col-lg-6">
                                    <Logo />
                                </div>

                                <div className="col-lg-6">
                                    <GameState currentGamePack={currentGamePack} gameState={gameState} userResult={userResult} />
                                </div>

                                {
                                    isShowLeaderBoard &&
                                    <div className="col-lg-4 order-2 order-lg-1 d-flex align-items-center justify-content-center">
                                        <Leaderboard leaderboard={leaderboard} />
                                    </div>
                                }

                                <div className={`col-lg-${isShowLeaderBoard ? '8' : '12'} order-1 order-lg-2`}>
                                    {
                                        currentGamePack && currentQuestion
                                            ?
                                            <>
                                                {
                                                    currentGamePack.__component === 'game-packs.quiz-packs' &&
                                                    <Quiz gamePack={currentGamePack} question={currentQuestion} userResult={userResult} gameState={gameState} handleAnswer={handleAnswer} isShowLeaderBoard={isShowLeaderBoard} />
                                                }
                                                {
                                                    currentGamePack.__component === 'game-packs.word-find-packs' &&
                                                    <WordFind question={currentQuestion} gameState={gameState} handleAnswer={handleAnswer} />
                                                }
                                                {
                                                    currentGamePack.__component === 'game-packs.matching-packs' &&
                                                    <Matching gamePack={currentGamePack} question={currentQuestion} userResult={userResult} gameState={gameState} handleAnswer={handleAnswer} />
                                                }
                                            </>
                                            :
                                            <div>Loading</div>
                                    }
                                </div>
                            </>
                }
            </div>
        </div>
    )
}

export default Games