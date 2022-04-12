import React from 'react';
import styles from "./Footer.module.sass"

export const Footer = () => {
    return <footer className={styles.footer}>
        <div className={`container ${styles.footer__container}`}>
            <div className="flex">
                <div>
                    <img src="/img/logo_new_desc.svg" className={`logo ${styles.footer__logo}`} alt="Логотип"/>
                </div>
                <div className="flex column">
                    <span>globalsportleague@gmail.com</span>
                    <a href="tel:+7(747)268-66-75">+7(747)268-66-75</a>
                    <div className={styles.footer__socials}>
                        <a href="https://www.instagram.com/globalsportleague/"
                           className={`${styles.footer__socials__item} ${styles.instagram}`} target="_blank">
                            <svg width="29" height="29"
                                 viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.9962 9.66461C11.4255 9.66461 9.32767 11.8375 9.32767 14.5C9.32767 17.1625 11.4255 19.3354 13.9962 19.3354C16.5669 19.3354 18.6648 17.1625 18.6648 14.5C18.6648 11.8375 16.5669 9.66461 13.9962 9.66461ZM27.9984 14.5C27.9984 12.4976 28.0159 10.5134 27.9074 8.51471C27.7988 6.19314 27.2875 4.13274 25.6484 2.4351C24.0058 0.733824 22.02 0.207844 19.7785 0.0953926C17.8453 -0.0170583 15.9295 0.00107896 13.9997 0.00107896C12.0665 0.00107896 10.1507 -0.0170583 8.22094 0.0953926C5.97947 0.207844 3.99016 0.737451 2.35109 2.4351C0.708507 4.13637 0.200673 6.19314 0.0921015 8.51471C-0.0164698 10.5171 0.00104174 12.5013 0.00104174 14.5C0.00104174 16.4987 -0.0164698 18.4866 0.0921015 20.4853C0.200673 22.8069 0.712009 24.8673 2.35109 26.5649C3.99367 28.2662 5.97947 28.7922 8.22094 28.9046C10.1542 29.0171 12.07 28.9989 13.9997 28.9989C15.933 28.9989 17.8488 29.0171 19.7785 28.9046C22.02 28.7922 24.0093 28.2625 25.6484 26.5649C27.291 24.8636 27.7988 22.8069 27.9074 20.4853C28.0195 18.4866 27.9984 16.5024 27.9984 14.5ZM13.9962 21.9399C10.0211 21.9399 6.81302 18.6172 6.81302 14.5C6.81302 10.3828 10.0211 7.0601 13.9962 7.0601C17.9713 7.0601 21.1795 10.3828 21.1795 14.5C21.1795 18.6172 17.9713 21.9399 13.9962 21.9399ZM21.4736 8.49294C20.5455 8.49294 19.796 7.71667 19.796 6.75539C19.796 5.79412 20.5455 5.01784 21.4736 5.01784C22.4018 5.01784 23.1513 5.79412 23.1513 6.75539C23.1515 6.98365 23.1083 7.20972 23.0241 7.42066C22.9399 7.6316 22.8163 7.82326 22.6605 7.98466C22.5047 8.14607 22.3196 8.27404 22.116 8.36126C21.9123 8.44848 21.694 8.49323 21.4736 8.49294Z"
                                    fill="#A5C9FF"/>
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/groups/503312797923963/"
                           className={`${styles.footer__socials__item} ${styles.facebook}`} target="_blank">
                            <svg width="29" height="29"
                                 viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M0 14.581C0 21.7899 5.05517 27.7844 11.6667 29V18.5274H8.16667V14.5H11.6667V11.2774C11.6667 7.65238 13.9218 5.63929 17.1115 5.63929C18.1218 5.63929 19.2115 5.8 20.2218 5.96071V9.66667H18.4333C16.7218 9.66667 16.3333 10.5524 16.3333 11.681V14.5H20.0667L19.4448 18.5274H16.3333V29C22.9448 27.7844 28 21.7911 28 14.581C28 6.56125 21.7 0 14 0C6.3 0 0 6.56125 0 14.581Z"
                                      fill="#A5C9FF"/>
                            </svg>
                        </a>
                        <a href="https://t.me/gsleague" className={`${styles.footer__socials__item} ${styles.telegram}`}
                           target="_blank">
                            <svg width="29" height="29"
                                 viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M29 14.5C29 22.5076 22.5076 29 14.5 29C6.49238 29 0 22.5076 0 14.5C0 6.49238 6.49238 0 14.5 0C22.5076 0 29 6.49238 29 14.5ZM15.0196 10.7046C13.6095 11.2907 10.7904 12.505 6.56367 14.3465C5.87733 14.6196 5.51725 14.8867 5.48463 15.1477C5.42904 15.5899 5.98246 15.7639 6.73404 15.9995C6.83675 16.0322 6.94308 16.0648 7.05183 16.101C7.79254 16.3415 8.78821 16.623 9.30538 16.6339C9.77542 16.6436 10.2998 16.4503 10.8786 16.0539C14.8275 13.3871 16.8659 12.0398 16.994 12.0108C17.0846 11.9903 17.2103 11.9637 17.2949 12.0398C17.3795 12.1147 17.371 12.2573 17.3625 12.296C17.307 12.5292 15.1392 14.5459 14.0155 15.5899C13.665 15.915 13.4173 16.1458 13.3666 16.1989C13.253 16.3161 13.137 16.4285 13.0258 16.536C12.3371 17.1982 11.8223 17.696 13.0548 18.508C13.6469 18.8983 14.1206 19.221 14.593 19.5424C15.109 19.894 15.6238 20.2444 16.2908 20.6818C16.4599 20.793 16.6218 20.9078 16.7801 21.0202C17.3807 21.4491 17.9208 21.8334 18.5878 21.773C18.9745 21.7367 19.3756 21.373 19.5786 20.2867C20.0583 17.7178 21.0033 12.1546 21.222 9.86121C21.2353 9.67079 21.2272 9.47948 21.1978 9.29088C21.1802 9.13854 21.106 8.99837 20.99 8.89817C20.8172 8.75679 20.5489 8.72658 20.4281 8.729C19.8831 8.73867 19.047 9.02988 15.0196 10.7046Z"
                                      fill="#A5C9FF"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
}
