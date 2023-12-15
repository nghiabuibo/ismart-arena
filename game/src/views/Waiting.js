import Logo from './Logo'
import styles from './Waiting.module.css'

function Waiting(props) {
    const { currentGamePack, leaderboard } = props

    return (
        <>
            <Logo />
            <div className="col-12">
                <div className={`m-auto d-flex align-items-center justify-content-center text-uppercase ${styles.titleWrapper}`}>
                    {currentGamePack?.name}
                </div>
                <div className={`fw-bold ${styles.playerCount}`}>{leaderboard?.leaderboard?.length ?? 0}</div>
                <div className={`text-uppercase text-center fw-bold text-white ${styles.player}`}>Players</div>
            </div>
        </>
    )
}

export default Waiting