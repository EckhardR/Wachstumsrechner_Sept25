import React from "react";
import { BackgroundSecond, TextFirst } from "../../utils/global-variables.js";

export default function Footer() {
    return (
        <footer
        className="navbar fixed-bottom bg-body-tertiary p-0 m-0"
            style={{ backgroundColor: BackgroundSecond, position: "fixed", width: "100%", margin:0 }}
        >
            <section className="pb-0 m-0" style={{  backgroundColor: BackgroundSecond, width:'100%', height:'25px', textAlign: "center", margin: "5px auto", color: TextFirst }}>
                Copyright &copy; {new Date().getFullYear()}
            </section>
        </footer>
    );
}