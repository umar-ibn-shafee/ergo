import * as React from "react"

import { withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {colorPalette} from './Common'

function arrowGenerator(color) {
  return {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${color} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${color} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.95em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${color} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.95em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${color}`,
      },
    },
  };
}

const styles = theme => ({
  arrowPopper: arrowGenerator(colorPalette[12]),
  arrow: {
    position: 'absolute',
    fontSize: 6,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  } as CSSProperties,
  tooltip: {
    backgroundColor: colorPalette[12],
    color: "unset",
    fontFamily: "Open Sans",
    fontSize: "10px",
    maxWidth: "200px",
  }
});

interface ErgoTooltipProps {
  classes: any,
  text: string,
  placement: any,
  open: boolean,
}

interface ErgoTooltipState {
  open: boolean,
  arrowRef: any,
}

class ErgoTooltip extends React.Component<ErgoTooltipProps, ErgoTooltipState> {
  constructor(props) {
    super(props)

    this.state = {
      arrowRef: null,
      open: props.open,
    };
  }

  handleClickAway() {
    this.setState({open: false})
  }

  onOpen() {
    this.setState({open: true})
  }

  onClose() {
    this.setState({open: false})
  }

  handleArrowRef = node => {
    this.setState({
      arrowRef: node,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <ClickAwayListener onClickAway={this.handleClickAway.bind(this)}>
        <Tooltip
          enterDelay={2000}
          onOpen={this.onOpen.bind(this)}
          onClose={this.onClose.bind(this)}
          title={
            <React.Fragment>
              {this.props.text}
              <span className={classes.arrow} ref={this.handleArrowRef} />
            </React.Fragment>
          }
          open={this.state.open}
          classes={{ popper: classes.arrowPopper, tooltip: classes.tooltip }}
          placement={this.props.placement}
          PopperProps={{
            popperOptions: {
              modifiers: {
                arrow: {
                  enabled: Boolean(this.state.arrowRef),
                  element: this.state.arrowRef,
                },
              },
            },
          }}
        >
          {this.props.children as React.ReactElement<any, any>}
        </Tooltip>
      </ClickAwayListener>
    );
  }
}


export default withStyles(styles)(ErgoTooltip);

