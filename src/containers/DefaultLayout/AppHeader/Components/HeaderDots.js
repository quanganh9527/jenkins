import React, { Fragment } from 'react';

import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu,
    Nav, Col, Row, Button, NavItem, DropdownItem
} from 'reactstrap';

import Flag from 'react-flagkit';

class HeaderDots extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };

    }

    render() {
        return (
            <Fragment>
                <div className="header-dots">
                    <UncontrolledDropdown>
                        <DropdownToggle className="p-0 mr-2" color="link" disabled>
                            <div className="icon-wrapper icon-wrapper-alt rounded-circle">
                                <div className="icon-wrapper-bg bg-focus" />
                                <div className="language-icon">
                                    <Flag className="mr-3 opacity-8" country="GB" size="40" />
                                </div>
                            </div>
                        </DropdownToggle>
                        <DropdownMenu right className="rm-pointers">
                            {/* <DropdownItem>
                                <Flag className="mr-3 opacity-8" country="US" />
                                USA
                            </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </Fragment>
        )
    }
}

export default HeaderDots;
