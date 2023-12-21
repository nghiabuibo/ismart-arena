import secondsToMinutesSeconds from '../../utils/secondsToMinutesSeconds'
import styles from './state.module.css'

const GameStateItem = (props) => {
    const { label, value } = props

    return (
        <div className={`d-flex align-items-center justify-content-center line-height-1 gap-2 ${styles.itemWrapper}`}>
            <span className={styles.itemLabel}>{label}: </span>
            <span className={styles.itemValue}>{value}</span>
        </div>
    )
}

function GameState(props) {
    const { currentGamePack, gameState, userResult } = props

    return (
        <div className="row mt-lg-5">
            <div className="col-md-4 text-center">
                <GameStateItem label="Question" value={`${gameState?.currentQuestion + 1}/${currentGamePack?.questions?.length}`} />
            </div>
            <div className="col-md-4 text-center">
                <GameStateItem label="Time" value={secondsToMinutesSeconds(gameState?.currentTimeLeft ?? 0)} />
            </div>
            <div className="col-md-4 text-center">
                <GameStateItem label="Score" value={userResult?.totalScore ?? 0} />
            </div>
        </div>
    )
}
export default GameState