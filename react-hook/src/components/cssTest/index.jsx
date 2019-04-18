/*
* =========================================================================
*  Copyright (C)2018 NCS Pte. Ltd. All Rights Reserved
*
*  This software is confidentifyential and proprietary to NCS Pte. Ltd. You shall
*  use this software only in accordance with the terms of the license
*  agreement you entered into with NCS.  No aspect or part or all of this
*  software may be reproduced, modified or disclosed without full and
*  direct written authorisation from NCS.
*
*  NCS SUPPLIES THIS SOFTWARE ON AN "AS IS" BASIS. NCS MAKES NO
*  REPRESENTATIONS OR WARRANTIES, EITHER EXPRESSLY OR IMPLIEDLY, ABOUT THE
*  SUITABILITY OR NON-INFRINGEMENT OF THE SOFTWARE. NCS SHALL NOT BE LIABLE
*  FOR ANY LOSSES OR DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING,
*  MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
*
*  =========================================================================
*/
/**
 * Created by Deng Xiaolong on 18/03/2019.
 */

import React from "react";
import "./style.scss";

export default function Index() {
    return (
        <div className="solar-syst">
            <div className="sun"/>
            <div className="mercury"/>
            <div className="venus"/>
            <div className="earth"/>
            <div className="mars"/>
            <div className="jupiter"/>
            <div className="saturn"/>
            <div className="uranus"/>
            <div className="neptune"/>
            <div className="pluto"/>
            <div className="asteroids-belt"/>
        </div>
    )
}

