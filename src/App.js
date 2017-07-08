import React, { Component } from 'react';
import './App.css';
import { Grid } from './components';
import { rand } from './utils';

const PLAYER = 1;
const ENEMY = 2;
const BASE_PLAYER_TILE = {
  owner: PLAYER,
  health: 1
};
const BASE_ENEMY_TILE = {
  owner: ENEMY,
  health: 1
};

const gridConfig = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

class App extends Component {
  state = {
    round: 1,
    gridConfig: gridConfig
  };
  componentDidMount() {
    const { gridConfig } = this.state;
    const rows = gridConfig.length - 1;
    const cols = gridConfig[0].length - 1;
    gridConfig[rand(0, rows)][rand(0, cols)] = {
      ...BASE_ENEMY_TILE
    };
    gridConfig[rand(0, rows)][rand(0, cols)] = {
      ...BASE_PLAYER_TILE
    };
    this.setState({ gridConfig });
  }

  confiningWithPlayer(i, j, player = PLAYER) {
    const { gridConfig } = this.state;
    const rowLimit = gridConfig.length - 1;
    const columnLimit = gridConfig[0].length - 1;

    for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
      for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
        if ((x !== i || y !== j) && gridConfig[x][y] && gridConfig[x][y].owner === player) {
          return true;
        }
      }
    }

    return false;
  }

  clickBox(gridConfig, r, c, player = PLAYER) {
    console.log(player, r, c);
    if (gridConfig[r][c] !== 0 && gridConfig[r][c].owner === player) {
      gridConfig[r][c].health += 1;
    } else if (gridConfig[r][c] !== 0 && gridConfig[r][c].owner !== player) {
      gridConfig[r][c].health -= 1;
      if (gridConfig[r][c].health === 0) {
        gridConfig[r][c] = 0;
      }
    }

    if (this.confiningWithPlayer(r, c, player)) {
      if (gridConfig[r][c] === 0) {
        const tile = player === PLAYER ? BASE_PLAYER_TILE : BASE_ENEMY_TILE;
        gridConfig[r][c] = {
          ...tile
        };
      }
    }

    return {
      gridConfig
    }
  }

  enemyMove(gridConfig) {
    const rows = gridConfig.length - 1;
    const cols = gridConfig[0].length - 1;
    const enemyMoveResult = this.clickBox(gridConfig, rand(0, rows), rand(0, cols), ENEMY);
    return {
      gridConfig: enemyMoveResult.gridConfig
    }
  }

  onBoxClick(r, c) {
    const { gridConfig, round } = this.state;
    const playerMoveResult = this.clickBox(gridConfig, r, c, PLAYER);
    const enemyMoveResult = this.enemyMove(playerMoveResult.gridConfig);

    this.setState({
      gridConfig: enemyMoveResult.gridConfig,
      round: round + 1
    });
  }

  render() {
    const { gridConfig, round } = this.state;
    const rows = gridConfig.length;
    const cols = gridConfig[0].length;
    return (
      <div>
        <div className="App">
          <Grid cols={cols} rows={rows}
            gridConfig={gridConfig}
            onBoxClick={(r, c) => this.onBoxClick(r, c)}
          />
        </div>
        <h2>Rounds: {round}</h2>
      </div>
    );
  }
}

export default App;
