import * as React from "react";
import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai/index.esm.js";
import { HtmlTooltip } from "./custom-tooltip.js";
import copy from 'copy-to-clipboard';

type Props = {
    clipboardText: any,
    children: any,
};

export function CopyToClipboard(props: Props) {
    const [Copy, setCopy] = useState(false);

    function handleClick() {
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 1000);
        copy(props.clipboardText);
    }

    return (
        <>
            <HtmlTooltip
                Title={<React.Fragment>{Copy ? <AiOutlineCheck size={18} /> : <>Copy</>}</React.Fragment>}
                placement={"top"}
                onClick={handleClick}
                className='d-flex justify-content-left'
            >
                    <button
                        style={{
                            background: "none",
                            color: "inherit",
                            border: "none",
                            padding: 0,
                            font: "inherit",
                            cursor: "pointer",
                            outline: "inherit",
                            width: "100%",
                        }}
                    >
                        {props.children}
                    </button>
            </HtmlTooltip>
        </>
    );
}