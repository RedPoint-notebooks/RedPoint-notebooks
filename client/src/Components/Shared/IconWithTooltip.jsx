import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IconWithTooltip = props => {
  return (
    <OverlayTrigger
      key="bottom"
      placement={props.placement}
      delay={1000}
      trigger="hover"
      overlay={<Tooltip id="tooltip">{props.tooltipText}</Tooltip>}
    >
      <FontAwesomeIcon icon={props.icon} className={props.class} />
    </OverlayTrigger>
  );
};

export default IconWithTooltip;
