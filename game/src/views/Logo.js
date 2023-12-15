import ismLogo from '../assets/imgs/3.12.UI_tach-02.png'
import arenaLogo from '../assets/imgs/3.12.UI_tach-03.png'
import styles from './Logo.module.css'

function Logo() {
    return (
        <div className='container'>
            <div className='row align-items-center pt-5 mb-5'>
                <div className="col-6 text-end">
                    <img src={ismLogo} className={`${styles.logo}`} alt='iSmart Logo' />
                </div>
                <div className="col-6 text-start">
                    <img src={arenaLogo} className={`${styles.logo}`} alt='Arena Logo' />
                </div>
            </div>
        </div>
    )
}

export default Logo