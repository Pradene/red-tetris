# Red Tetris - Online Tetris Game

## Overview

**Red Tetris** is an engaging online Tetris game that allows players to enjoy both solo and multiplayer modes. Whether you're looking to play by yourself or compete against others, Red Tetris offers a thrilling experience with smooth gameplay and intuitive controls. 

### Features:
- **Solo Mode**: Play Tetris by yourself and try to achieve the highest score.
- **Multiplayer Mode**: Challenge your friends or other players online in real-time to see who can last the longest.

## Installation

### Env

Add a .env file inside server (there is an example) :

```txt
JWT_SECRET={secret}
```

To run Red Tetris locally on your system or deploy it for your own server, follow the instructions below.

### Prerequisites

- Web Browser (Chrome, Firefox, Safari, etc.)
- Internet connection for multiplayer features

### Running the Game Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Pradene/red-tetris.git
2. Run the server and client:
    ```bash
   npm run start:dev # Inside server dir
   npm run start:dev # Inside client dir
3. Visit the website: http://localhost:5173/