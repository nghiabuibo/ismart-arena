import { useEffect, useState } from "react"
import socket from "../utils/socket"
import handleRequestError from "../utils/handleRequestError"

function AdminControls(props) {
    const { adminToken, setAdminToken } = props
    const [contestGroups, setContestGroups] = useState([])
    const [time, setTime] = useState(null)
    const defaultGameStatusGameChange = 'paused'
    const defaultGameStatusQuestionChange = 'playing'

    // handle socket authen
    useEffect(() => {
        socket.auth = {
            strategy: 'apiToken',
            token: adminToken
        }
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [adminToken])

    useEffect(() => {
        socket.on('connect_error', (err) => {
            handleRequestError(err)
            localStorage.setItem('admin_token', '')
            setAdminToken('')
        })

        return () => {
            socket.off('connect_error')
        }
    }, [setAdminToken])

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('admin:getContestGroups')
        })

        socket.on('admin:updateContestGroups', setContestGroups)

        socket.on('contest-setting:update', () => {
            socket.emit('admin:getContestGroups')
        })

        return () => {
            socket.off('connect')
            socket.off('admin:updateContestGroups')
            socket.off('contest-setting:update')
        }
    }, [])

    const handleChangeGame = (contestGroupID, action) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            let value = newContestGroup.state.currentGamePack
            switch (action) {
                case 'prev':
                    value -= 1
                    if (value < 0) {
                        value = 0
                    } else {
                        // only change game status if game changed
                        newContestGroup.state.currentStatus = defaultGameStatusGameChange
                    }
                    break;
                case 'next':
                    value += 1
                    // restrict max game
                    if (value > newContestGroup.contest.gamePacks.length - 1) {
                        value = newContestGroup.contest.gamePacks.length - 1
                    } else {
                        // only change game status if game changed
                        newContestGroup.state.currentStatus = defaultGameStatusGameChange
                    }
                    break;
                default:
                    break;
            }
            newContestGroup.state.currentGamePack = value
            newContestGroup.state.currentQuestion = 0
            newContestGroup.state.currentTimeLeft = newContestGroup.contest.gamePacks[value].questions?.[0]?.timeLimit ?? null
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const handleChangeQuestion = (contestGroupID, action) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            const currentGamePack = newContestGroup.state.currentGamePack
            let value = newContestGroup.state.currentQuestion
            switch (action) {
                case 'prev':
                    value -= 1
                    if (value < 0) {
                        value = 0
                    } else {
                        // only change game status if question changed
                        newContestGroup.state.currentStatus = defaultGameStatusQuestionChange
                    }
                    break;
                case 'next':
                    value += 1
                    // restrict max question
                    const questionLength = newContestGroup.contest.gamePacks[currentGamePack].questions?.length
                    if (value > questionLength - 1) {
                        value = questionLength - 1
                    } else {
                        // only change game status if question changed
                        newContestGroup.state.currentStatus = defaultGameStatusQuestionChange
                    }
                    break;
                default:
                    break;
            }
            newContestGroup.state.currentQuestion = value
            newContestGroup.state.currentTimeLeft = newContestGroup.contest.gamePacks[currentGamePack].questions?.[value]?.timeLimit ?? null
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const handleChangeTime = (contestGroupID) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            newContestGroup.state.currentTimeLeft = time
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const handleChangeStatus = (contestGroupID, action) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            newContestGroup.state.currentStatus = action
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const renderControls = contestGroups.map(contestGroup => {
        return (
            <table key={contestGroup.id} className="table table-bordered mb-5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Contest</th>
                        <th>Group</th>
                        <th>Current Game</th>
                        <th>Current Question</th>
                        <th>Current Time Left</th>
                        <th>Current Status</th>
                        <th>Controls</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{contestGroup.id}</td>
                        <td>{contestGroup.contest?.name}</td>
                        <td>{`${contestGroup.group?.name} (Grade: ${contestGroup.group?.grades})`}</td>
                        <td>{contestGroup.state?.currentGamePack + 1}</td>
                        <td>{contestGroup.state?.currentQuestion + 1}</td>
                        <td>{contestGroup.state?.currentTimeLeft}</td>
                        <td>{contestGroup.state?.currentStatus}</td>
                        <td>
                            <button onClick={() => handleChangeGame(contestGroup.id, 'prev')}>Previous Game</button>
                            <button onClick={() => handleChangeGame(contestGroup.id, 'next')}>Next Game</button>
                            <br /><br />
                            <button onClick={() => handleChangeQuestion(contestGroup.id, 'prev')}>Previous Question</button>
                            <button onClick={() => handleChangeQuestion(contestGroup.id, 'next')}>Next Question</button>
                            <br /><br />
                            <input type="number" name="time" onChange={(e) => setTime(e.target.value)} />
                            <button onClick={() => handleChangeTime(contestGroup.id)}>Set Time</button>
                            <br /><br />
                            <button onClick={() => handleChangeStatus(contestGroup.id, 'playing')}>Start</button>
                            <button onClick={() => handleChangeStatus(contestGroup.id, 'paused')}>Pause</button>
                            <button onClick={() => handleChangeStatus(contestGroup.id, 'ended')}>End</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    })

    return (
        <>
            {/* <pre>
                {JSON.stringify(gameStates, null, 4)}
            </pre> */}
            {
                renderControls
            }
        </>
    )
}

export default AdminControls