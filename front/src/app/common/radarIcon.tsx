import * as React from "react";
import {SvgIcon} from "@material-ui/core";
import {SvgIconProps} from "@material-ui/core/SvgIcon";

export class RadarIcon extends React.Component<SvgIconProps> {
    render() {
        return (
            <SvgIcon {...this.props}>
                <path fill="none" strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit="4" strokeWidth="51.2"  stroke="#000" d="M512 59.085l-465.51 338.125 177.869 547.226h575.283l177.869-547.226-465.51-338.125z"></path>
                <path fill="none" strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit="4" strokeWidth="30.72" stroke="#000" d="M512 259.277l-278.528 202.342 106.394 327.373h344.269l106.394-327.373-278.528-202.342z"></path>
                <path fill="none" strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit="4" strokeWidth="20.48" stroke="#000" d="M512 394.854l-135.885 98.816 51.917 159.744h167.936l51.917-159.744-135.885-98.816z"></path>
                <path fill="none" strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit="4" strokeWidth="20.48" stroke="#000" d="M512 535.245l-449.229-128.922"></path>
                <path fill="none" strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit="4" strokeWidth="20.48" stroke="#000" d="M512 535.245v-476.16"></path>
                <path fill="none" strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit="4" strokeWidth="20.48" stroke="#000" d="M512 535.245l465.51-138.035"></path>
                <path fill="none" strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit="4" strokeWidth="20.48" stroke="#000" d="M512 535.245l287.642 409.19"></path>
                <path fill="none" strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit="4" strokeWidth="20.48" stroke="#000" d="M512 535.245l-287.642 409.19"></path>
            </SvgIcon>
        )
    }
}