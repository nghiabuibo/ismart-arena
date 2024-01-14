import { getMediaUrl } from '../utils/media'
import Logo from './Logo'
import styles from './Waiting.module.css'

const CoverImage = (props) => {
    const { coverImage } = props
    const imageUrl = getMediaUrl(coverImage)
    return (
        <>
            <div className={styles.coverBg}></div>
            <img src={imageUrl} className={styles.coverImage} alt='Game Cover' />
        </>
    )
}

function Waiting(props) {
    const { currentGamePack, leaderboard } = props

    return (
        currentGamePack?.coverImage
            ?
            <CoverImage coverImage={currentGamePack.coverImage} />
            :
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