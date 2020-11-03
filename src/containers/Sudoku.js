import React, { Component } from 'react';
import ReactLoading from "react-loading";
import { Fireworks } from 'fireworks/lib/react'

import "./Sudoku.css"
import Header from '../components/Header';
import Grid_9x9 from '../components/Grid_9x9';
import ScreenInputKeyBoard from '../components/ScreenInputKeyBoard'
import { problemList } from "../problems"

class Sudoku extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true, // Return loading effect if this is true.
            problem: null, // Stores problem data. See "../problems/" for more information.This is the origin problem and should not be modified. This is used to distinguish the fixed numbers from the editable values
            gridValues: null,  // A 2D array storing the current values on the gameboard. You should update this when updating the game board values.
            selectedGrid: { row_index: -1, col_index: -1 }, // This objecct store the current selected grid position. Update this when a new grid is selected.
            gameBoardBorderStyle: "8px solid #000", // This stores the gameBoarderStyle and is passed to the gameboard div. Update this to have a error effect (Bonus #2).
            completeFlag: false, // Set this flag to true when you want to set off the firework effect.
            conflicts: [{ row_index: -1, col_index: -1 }] // The array stores all the conflicts positions triggered at this moment. Update the array whenever you needed.
        }
    }

    handle_grid_1x1_click = (row_index, col_index) => {
        // TODO
        if(this.state.problem.content[row_index][col_index] === "0")
        {
            this.setState({selectedGrid: { row_index: row_index, col_index: col_index}});
        }
        // Useful hints:
    }

    handleKeyDownEvent = (event) => {
        // TODO

        // Useful hints:
        let newGrid = this.state.gridValues;
        let num = 0;
        if (((this.state.gridValues !== null) && (this.state.selectedGrid.row_index !== -1) && (this.state.selectedGrid.col_index !== -1) && (event.keyCode >= 48 && event.keyCode <= 57)) || (event.keyCode >= 96 && event.keyCode <= 105)) 
        {
            if(event.keyCode >= 48 && event.keyCode <= 57)
            {
                num = event.keyCode - 48;
            }
            else if(event.keyCode >= 96 && event.keyCode <= 105)
            {
                num = event.keyCode - 96;
            }
            if (this.state.problem !== null)  
            {
                if(this.state.problem.content[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] === "0")
                {
                    if(this.checkInput(newGrid, this.state.selectedGrid.row_index, this.state.selectedGrid.col_index, num))
                    {
                        newGrid[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = (num === 0 ? "" : num);
                        this.setState({gridValues: newGrid});
                        this.checkComplete();
                    }
                }
            }
        }
    }

    handleScreenKeyboardInput = (num) => {
        if(this.state.problem !== null && this.state.problem.content[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] === "0")
        {
            let newGrid = this.state.gridValues;
            if(this.checkInput(newGrid, this.state.selectedGrid.row_index, this.state.selectedGrid.col_index, num))
            {
                newGrid[this.state.selectedGrid.row_index][this.state.selectedGrid.col_index] = (num === 0 ? "" : num);
                this.setState({gridValues: newGrid});
                this.checkComplete();
            }
        }
    }

    checkInput = (grid, row_index, col_index, num) => {
        if(num == 0)
        {
            return true;
        }
        this.setState({conflicts: [{ row_index: -1, col_index: -1 }]});
        let gridId = Math.floor(col_index / 3) + Math.floor(row_index / 3) * 3;
        // console.log("checking input");
        // console.log(row_index);
        // console.log(col_index);
        // console.log(num);
        //check the same grid
        for(let i = Math.floor(gridId / 3) * 3; i < Math.floor(gridId / 3) * 3 + 3; i++)
        {
            for(let j = (gridId % 3) * 3; j < (gridId % 3) * 3 + 3; j++)
            {
                if(grid[i][j] == num)
                {
                    console.log("grid conflict");
                    this.setState({conflicts: [...this.state.conflicts, { row_index: i, col_index: j}]});
                    // return false;
                }
            }
        }
        //check the same row
        for(let i = 0; i < 9; i++)
        {
            if(grid[row_index][i] == num)
            {
                console.log("row conflict");
                this.setState({conflicts: [...this.state.conflicts, { row_index: row_index, col_index: i}]});
                // return false;
            }
        }
        //check the same col
        for(let i = 0; i < 9; i++)
        {
            if(grid[i][col_index] == num)
            {
                console.log("col conflict");
                this.setState({conflicts: [...this.state.conflicts, { row_index: i, col_index: col_index}]});
                // return false;
            }
        }
        if(this.state.conflicts.length === 1)
        {
            // console.log("no conflict");
            return true;
        }
        else
        {
            setTimeout(() => {
                this.setState({conflicts: [{ row_index: -1, col_index: -1 }]});
            }, 1000)
            this.setState({ gameBoardBorderStyle: "8px solid #E77" });
            setTimeout(() => { this.setState({ gameBoardBorderStyle: "8px solid #333" }); }, 1000);
            return false;
        }
    }

    checkComplete = () => {
        for(let i = 0; i < 9; i++)
        {
            for(let j = 0; j < 9; j++)
            {
                if(this.state.gridValues[i][j] === "" || this.state.gridValues[i][j] === "0")
                {
                    return false;
                }
            }
        }
        this.setState({ completeFlag: true });
        setTimeout(() => { this.setState({ completeFlag: false }); }, 2500);    
        return true;
    }

    componentDidMount = () => {
        window.addEventListener('keydown', this.handleKeyDownEvent);
    }

    loadProblem = async (name) => {
        this.setState({
            loading: true,
            problem: null,
            gridValues: null,
            selectedGrid: { row_index: -1, col_index: -1 }
        });

        const problem = await require(`../problems/${name}`)
        if (problem.content !== undefined) {
            let gridValues = [];
            for (let i = 0; i < problem.content.length; i++)
                gridValues[i] = problem.content[i].slice();
            this.setState({ problem: problem, gridValues: gridValues, loading: false });
        }
    }

    extractArray(array, col_index, row_index) {
        let rt = []
        for (let i = row_index; i < row_index + 3; i++) {
            for (let j = col_index; j < col_index + 3; j++) {
                rt.push(array[i][j])
            }
        }
        return rt;
    }

    render() {
        const fxProps = {
            count: 3,
            interval: 700,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            colors: ['#cc3333', '#81C784'],
            calc: (props, i) => ({
                ...props,
                x: (i + 1) * (window.innerWidth / 3) * Math.random(),
                y: window.innerHeight * Math.random()
            })
        }
        return (
            <>
                <Header problemList={problemList} loadProblem={this.loadProblem} gridValues={this.state.gridValues} problem={this.state.problem} />
                {this.state.loading ? (<ReactLoading type={"bars"} color={"#777"} height={"40vh"} width={"40vh"} />) : (
                    <div id="game-board" className="gameBoard" style={{ border: this.state.gameBoardBorderStyle }}>
                        <div className="row">
                            <Grid_9x9 row_offset={0} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={3} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={6} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                    </div>
                )}
                {this.state.completeFlag ? (<Fireworks {...fxProps} />) : null}
                {this.state.loading ? null : (<ScreenInputKeyBoard handleScreenKeyboardInput={this.handleScreenKeyboardInput} />)}
            </>
        );
    }
}

export default Sudoku;