
import * as React from "react"
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { colorPalette } from './Common'

import { withStyles } from '@material-ui/core/styles';

export default class Notification extends React.Component<{open: boolean, variant: string, handleClose: any}> {
  constructor(props: any) {
    super(props)
  }

  handleClose() {
    this.props.handleClose();
  }

  render() {
    const color = {
      "success": colorPalette[8],
      "failure": colorPalette[9],
    }[this.props.variant];

    const message = {
      "success": "Correct!",
      "failure": "Wrong! Try Again",
    }[this.props.variant]

    const messageStyle = {
      "success": {
        padding: '10px',
        fontSize: '24px',
        width: '130px',
        textAlign: 'center',
      },
      "failure": {
        padding: "10px",
        fontSize: '15px',
        width: "130px",
        textAlign: "center",
      }
    }[this.props.variant]

    const CustomSnackbar = withStyles({
      root: {
        top: "25px",
        left: "385px",
        position: "fixed",
        width: "150px",
        border: "none",
        boxShadow: "none"
      }
    })(Snackbar)

    const CustomSnackbarContent = withStyles({
      root: {
        backgroundColor: `${color}`,
        borderRadius: "10px",
        border: `1px solid ${color}`,
        padding: "0px",
        lineHeight: "unset",
        boxShadow: "none",
        minWidth: "unset"
      },
      message: messageStyle
    })(SnackbarContent)

    return (
      <CustomSnackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={this.props.open}
        autoHideDuration={3000}
        onClose={this.handleClose.bind(this)}
      >
        <CustomSnackbarContent
          message={
            <span>
              {message}
            </span>
          }
        />
      </CustomSnackbar>
    )
  }
}

