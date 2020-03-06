import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    TextField,
    Paper,
    Grid,
    Typography,
    Button,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import './Home.css';
import web3 from '../../web3';
import Marquee from '../../contracts/Marquee';

const styles = theme => ({
    paper: {
        margin: `${theme.spacing(1)}px 0`,
        padding: theme.spacing(2),
        minHeight: '60px',
    },
    divider: {
        margin: `${theme.spacing(4)}px 0`,
    },
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            currentBlock: 0,
            currentSpace: '',
            spaces: [],
            reserveWindow: 0,
            loading: false,
            error: '',
            displayErrorModal: false,
        };
        this.inputRef = createRef();
        this.openReserveWindow = this.openReserveWindow.bind(this);
        this.reserve = this.reserve.bind(this);
        this.update = this.update.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissError = this.dismissError.bind(this);
        this.initApp = this.initApp.bind(this);
    }

    async componentDidMount() {
        try {
            const { provider, account } = await web3();
            const marqueeInstance = await Marquee(provider);
            this.marqueeInstance = marqueeInstance;
            this.setState(
                {
                    account,
                },
                () => {
                    this.initApp();
                },
            );
        } catch (e) {
            this.showError(e.message);
        }
    }

    initApp() {
        clearInterval(this.reloadInterval);

        this.reloadInterval = setInterval(async () => {
            const {
                words: [bn],
            } = await this.marqueeInstance.getCurrentBlockNumber();
            if (this.state.currentBlock !== bn) {
                this.state.currentBlock = bn;
                this.setState(
                    {
                        currentBlock: bn,
                    },
                    () => {
                        this.update();
                    },
                );
            }
        }, 1000);
    }

    async update() {
        const cs = await this.marqueeInstance.getCurrentSpace();
        const availability = await this.marqueeInstance.getCurrentSpaceAvailability();
        const spaces = availability.map((available, index) => {
            return { block: this.state.currentBlock + index, available };
        });
        this.setState({
            currentSpace: cs,
            spaces,
        });
    }

    reserve() {
        this.setState(
            {
                loading: true,
            },
            async () => {
                try {
                    await this.marqueeInstance.reserveSpace(
                        this.state.reserveWindow,
                        this.inputRef.current.value,
                        {
                            from: this.state.account,
                        },
                    );
                } catch (e) {
                    this.showError(e.message);
                } finally {
                    this.openReserveWindow(0);
                    this.setState({
                        loading: false,
                    });
                    await this.update();
                }
            },
        );
    }

    openReserveWindow(block) {
        this.setState({
            reserveWindow: block,
        });
    }

    showError(error) {
        this.setState({
            error: error,
            displayErrorModal: true,
        });
    }

    dismissError() {
        this.setState({
            displayErrorModal: false,
        });
    }

    render() {
        const { classes } = this.props;
        const {
            loading,
            reserveWindow,
            spaces,
            currentSpace,
            displayErrorModal,
            error,
        } = this.state;
        return (
            <>
                <Typography variant="h5" gutterBottom>
                    {'Current Space '}
                    <small>{(spaces.length && spaces[0].block) || ''}</small>
                </Typography>
                <div
                    className={`currentSpace${(!currentSpace &&
                        ' emptySpace') ||
                        ''}`}>
                    {currentSpace || 'Space for rent'}
                </div>

                <Divider className={classes.divider} />

                <Typography variant="h5" gutterBottom>
                    Spaces
                </Typography>

                <Grid container spacing={2}>
                    {spaces.slice(1).map(({ block, available }) => (
                        <Grid key={block} item xs={4}>
                            <Paper className={classes.paper}>
                                <div>{block}</div>
                                {available && (
                                    <Button
                                        color="primary"
                                        onClick={() =>
                                            this.openReserveWindow(block)
                                        }>
                                        Reserve
                                    </Button>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Dialog
                    open={!!reserveWindow}
                    onClose={() => !loading && this.openReserveWindow(0)}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        Reserve {reserveWindow}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Type the data to reserve the slot.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="text"
                            label="Text"
                            fullWidth
                            disabled={loading}
                            inputRef={this.inputRef}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.openReserveWindow(0)}
                            color="primary"
                            disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => this.reserve()}
                            color="primary"
                            disabled={loading}>
                            {(loading && 'Loading...') || 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={displayErrorModal} onClose={this.dismissError}>
                    <DialogTitle>{'Error'}</DialogTitle>
                    <DialogContent>{error}</DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={this.dismissError}>Close</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
