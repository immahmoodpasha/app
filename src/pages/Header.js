import "../styles/Header.css";
import { FiSearch, FiMessageCircle, FiLink } from 'react-icons/fi';
import exit from "../assets/exit.png"
import msg from "../assets/box.png"
import lnk from "../assets/paperclip.png"
import let_z from "../assets/letter-z.png"


function Header() {
    return(
        <div id="head-cont">
            <div id="logo-cont">
                <img id="logo" src={let_z} alt="Logo"/>
                <h1 id="comp-name">Zepto</h1>
            </div>
            <div id="profileIcon-cont">
                <div id="search-cont">
                    <FiSearch id="search-icon" />
                    <input id="search" placeholder="search"/>
                </div>
                <button id="msg-manager"><img src={msg} /></button>
                <button id="lnk-manager"><img src={lnk} /></button>
                <button id="logout-manager"><img src={exit} /></button>
            </div>
        </div>
    );
}

export default Header;