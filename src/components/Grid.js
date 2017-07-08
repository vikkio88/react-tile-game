import React, { Component } from 'react';
import { range } from '../utils';

class Grid extends Component {
    render() {
        const { rows, cols, onBoxClick, gridConfig } = this.props;
        const grid = range(rows).map((_, rowIdx) => {
            const tempCols = range(cols).map((_, colIdx) => {
                let className = 'col box ';

                if (gridConfig[rowIdx][colIdx] !== 0 && gridConfig[rowIdx][colIdx].owner !== 1) {
                    className += 'enemy';
                } else if (gridConfig[rowIdx][colIdx] !== 0) {
                    className += 'player';
                }


                return (
                    <div
                        key={`${rowIdx}_${colIdx}`}
                        className={className}
                        onClick={() => onBoxClick(rowIdx, colIdx)}
                    >
                        {gridConfig[rowIdx][colIdx] !== 0 ? gridConfig[rowIdx][colIdx].health : ''}
                    </div>
                )
            });
            return (
                <div key={rowIdx} className="row">
                    {tempCols}
                </div>
            );
        });
        return (
            <div>
                {grid}
            </div>
        );
    }
}

export { Grid };