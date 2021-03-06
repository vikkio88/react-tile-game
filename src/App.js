import React, { Component } from 'react';
import './App.css';
import { Grid, Overlay } from './components';
import { rand, range } from './utils';

const COLS = 8;
const ROWS = 8;
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

const getStartingGridConfig = () => range(COLS).map(() => range(ROWS).map(() => 0));

class App extends Component {
  state = {
    round: 1,
    gridConfig: getStartingGridConfig(),
    tileCount: {
      player: 1,
      enemy: 1
    },
    gameOver: false
  };

  componentDidMount() {
    const { gridConfig } = this.state;
    const upperRows = Math.round((ROWS - 1) / 2);
    gridConfig[rand(0, upperRows)][rand(0, COLS - 1)] = {
      ...BASE_ENEMY_TILE
    };

    gridConfig[rand(upperRows, ROWS)][rand(0, COLS)] = {
      ...BASE_PLAYER_TILE
    };
    this.setState({ gridConfig });
  }

  adjacentToPlayer(i, j, player = PLAYER) {
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
    console.log('not adjacent to ' + player)
    return false;
  }

  clickBox(gridConfig, r, c, player = PLAYER) {
    console.log(player === PLAYER ? 'player' : '"ai"', r, c);

    if (this.adjacentToPlayer(r, c, player)) {
      if (gridConfig[r][c] !== 0 && gridConfig[r][c].owner === player) {
        gridConfig[r][c].health += 1;
      } else if (gridConfig[r][c] !== 0 && gridConfig[r][c].owner !== player) {
        gridConfig[r][c].health -= 1;
        if (gridConfig[r][c].health === 0) {
          gridConfig[r][c] = 0;
        }
      } else if (gridConfig[r][c] === 0) {
        const tile = player === PLAYER ? BASE_PLAYER_TILE : BASE_ENEMY_TILE;
        gridConfig[r][c] = {
          ...tile
        };
      }
    }

    return gridConfig;
  }

  enemyMove(gridConfig) {
    // moving randomly (cant be bothered of doing it yet)
    return this.clickBox(
      gridConfig,
      rand(0, ROWS),
      rand(0, COLS),
      ENEMY
    );
  }

  onBoxClick(r, c) {
    let { gridConfig, round, gameOver } = this.state;
    gridConfig = this.clickBox(gridConfig, r, c, PLAYER);
    gridConfig = this.enemyMove(gridConfig);
    const tileCount = this.countTiles(gridConfig);

    round += 1;
    if (tileCount.player === 0 || tileCount.enemy === 0) {
      gameOver = {
        winner: tileCount.player === 0 ? 'Enemy won' : 'Player won'
      }
    }

    this.setState({
      gridConfig,
      round,
      tileCount,
      gameOver
    });
  }

  countTiles(gridConfig) {
    let player = 0;
    let enemy = 0;
    gridConfig.forEach(row => {
      row.forEach(col => {
        if (col !== 0) {
          col.owner === PLAYER ? player += 1 : enemy += 1
        }
      });
    });

    return {
      player,
      enemy
    }
  }

  render() {
    const { gridConfig, round, tileCount, gameOver } = this.state;
    return (
      <div className="App">
        <h2>Rounds: {round}</h2>
        {
          gameOver &&
          <Overlay message={gameOver.winner} />
        }
        <div className="gridContainer">
          <Grid cols={COLS} rows={ROWS}
            gridConfig={gridConfig}
            onBoxClick={(r, c) => this.onBoxClick(r, c)}
          />
        </div>
        <h2>Player {tileCount.player} - {tileCount.enemy} Enemy</h2>
      </div>
    );
  }
}

export default App;
