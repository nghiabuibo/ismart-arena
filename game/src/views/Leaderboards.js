import Logo from "./Logo"

import styles from './Leaderboards.module.css'

function Leaderboards(props) {
    const { leaderboard, setShowTop3 } = props

    if (leaderboard?.leaderboard) leaderboard.leaderboard.length = 50
    const renderLeaderboard = leaderboard?.leaderboard?.map((entry, index) => {
        return (
            <div key={entry.id} className={`d-flex align-items-center gap-3 mb-3 ${styles.leaderboardEntry}`}>
                <div className={`${styles.leaderboardRanking}`}>{index + 1}.</div>
                <div className={`d-flex ${styles.leaderboardInfo}`}>
                    <div className={`${styles.leaderboardCorrected}`}>{entry.totalCorrected}</div>
                    <div className={`${styles.leaderboardName}`}>{entry.user.name}</div>
                </div>
            </div>
        )
    })

    // const renderLeaderboard = null

    return (
        <>
            <Logo />

            {
                leaderboard?.contest?.titleImage?.url &&
                <div className={`row`}>
                    <img className={`img-fluid ${styles.titleImage}`} src={process.env.REACT_APP_CMS_URL + leaderboard.contest.titleImage.url} alt="Contest Title" />
                </div>
            }

            <div className={`${styles.leaderboardWrapper}`}>

                {
                    leaderboard?.group?.name &&

                    <div className={`${styles.leaderboardGroup}`}>
                        {leaderboard?.group.name}
                    </div>
                }

                {
                    renderLeaderboard
                        ?
                        <div className={`mb-5 ${styles.leaderboardRankingWrapper}`}>
                            {renderLeaderboard}
                        </div>
                        :
                        <div className="text-center text-white mt-5">
                            <div>No leaderboard data</div>
                        </div>
                }

                <button className={styles.showTop3} onClick={() => setShowTop3(true)}>Show Top 3</button>

            </div>
        </>
    )
}

export default Leaderboards