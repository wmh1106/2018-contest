function Game() {
    this.board = []
    // 是否能合并
    this.hasConflicted = []
    // 分数
    this.score = 0
}

// Game.prototype.board = [
//     [0, 0, 0, 0],
//     [0, 0, 0, 0],
//     [8, 4, 0, 0],
//     [4, 4, 4, 0]
// ]

// 初始化
Game.prototype.init = function () {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var gridCell = $('#grid_cell_' + i + '_' + j);
            gridCell.css('top', this.getTop(i));
            gridCell.css('left', this.getLeft(j));
        }
    }

    for (let i = 0; i < 4; i++) {
        this.hasConflicted[i] = []
        this.board[i] = []
        for (let j = 0; j < 4; j++) {
            this.board[i][j] = 0
            this.hasConflicted[i][j] = false
        }
    }
    this.updateBoardView()

    this.score = 0
    $('#score').text(this.score)
}

// 在4*4容器中，随机找到一个为0的格子，在随机生成一个数字
Game.prototype.generateOneNumber = function () {
    if (this.noSpace()) {
        return false
    }
    // 随机一个位置-先随机一个坐标
    let randomX = parseInt(Math.floor(Math.random() * 4))
    let randomY = parseInt(Math.floor(Math.random() * 4))

    // 在用循环检测，这个坐标只有为0，才可用
    let times = 0
    while (times < 50) {
        if (this.board[randomX][randomY] === 0) {
            break
        }

        randomX = parseInt(Math.floor(Math.random() * 4))
        randomY = parseInt(Math.floor(Math.random() * 4))
        times += 1
    }

    if (times >= 50) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0) {
                    randomX = i
                    randomY = j
                }
            }
        }
    }
    // 随机一个数字（2或4，规则只生成这两个）
    let randomNumber = Math.random() < 0.5 ? 2 : 4

    // 在随机位置显示随机数字，更新这个位置的数字
    this.board[randomX][randomY] = randomNumber

    // 显示数字有动画
    this.showNumberAnimation(randomX, randomY, randomNumber)
    return true
}

// 更新： 二维数组 board (通过 updateBoardView) ==> 前端展示数字 number_cell
Game.prototype.updateBoardView = function () {
    // 清空 number_cell
    $('.number_cell').remove()

    let strNumberCell = ''
    // 重新生成 number_cell
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (this.board[i][j] === 0) {
                strNumberCell += `<div class="number_cell" 
                    id="number_cell_${i}_${j}"
                    style='width:100px;
                        height:100px;
                        opacity:0;
                        top:${this.getTop(i)}px;
                        left:${this.getLeft(j)}px;
                        font-size:20px;'>
                    </div>`
            } else {
                strNumberCell += `<div class="number_cell" 
                    id="number_cell_${i}_${j}"
                    style='width:100px;
                        height:100px;
                        opacity:1;
                        top:${this.getTop(i)}px;
                        left:${this.getLeft(j)}px;
                        font-size:20px;
                        background-color:${this.getNumberBackgroundColor(this.board[i][j])};
                        color:${this.getNumberColor(this.board[i][j])};
                        font-size:20px'>
                        ${this.board[i][j]}
                    </div>`
            }

            this.hasConflicted[i][j] = false;
        }
    }
    $('#game').append(strNumberCell)
}
// 更新分数
Game.prototype.updateScore = function () {
    $('#score').text(this.score)
}
// 结束
Game.prototype.gameOver = function () {
    alert('结束')
}

// 每次生成数字的动画
Game.prototype.showNumberAnimation = function (i, j, randomNumber) {
    var numberCell = $('#game').find('#number_cell_' + i + '_' + j)

    numberCell.css('background-color', this.getNumberBackgroundColor(randomNumber))
    numberCell.css('color', this.getNumberColor(randomNumber))
    numberCell.html(randomNumber)
    numberCell.animate({
        opacity: 1,
        top: this.getTop(i),
        left: this.getLeft(j)
    }, 100)
}
// 格子移动 动画
Game.prototype.showMoveAnimation = function (fromX, fromY, toX, toY) {
    var number_cell = document.querySelector(`#number_cell_${fromX}_${fromY}`)

    $(number_cell).animate({
        top: this.getTop(toX),
        left: this.getLeft(toY)
    }, 200)
}


// 计算 top
Game.prototype.getTop = function (t) {
    return t * 100
}
// 计算 left
Game.prototype.getLeft = function (l) {
    return l * 100
}
// 获取 number 格子的背景色
Game.prototype.getNumberBackgroundColor = function (number) {
    switch (number) {
        case 2:
            return '#eee4da';
        case 4:
            return '#ede0c8';
        case 8:
            return '#f2b179';
        case 16:
            return '#f59563';
        case 32:
            return '#f07c5f';
        case 64:
            return '#ff5e3b';
        case 128:
            return '#edcf72';
        case 256:
            return '#fd0361';
        case 512:
            return '#9c0';
        case 1024:
            return '#33b5e5';
        case 2048:
            return '#09c';
        case 4096:
            return '#a6c';
        case 8192:
            return '#93c';
        case 16384:
            return '#888';
        default:
            return '#111';
    }
}
// 获取 number 格子的字体颜色
Game.prototype.getNumberColor = function (number) {
    if (number <= 4) {
        return '#776e65'
    }
    return '#fff'
}
// 判断这个4*4的容器里，数字是不是都不等于0 ，都不是0 ==> 没有空格了。 是0 ==> 有空格可以移动
Game.prototype.noSpace = function () {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (this.board[i][j] === 0) {
                return false
            }
        }
    }
    return true
}
// 判断这个4*4容器里，4个方向是否还可以移动
Game.prototype.noMove = function () {
    if (this.canMoveDown() || this.canMoveLeft() || this.canMoveRight() || this.canMoveUp()) {
        return false
    } else {
        return true
    }
}

// 判断是否能左移
Game.prototype.canMoveLeft = function () {
    // 左边是否有数字？左边数字是否和自己相等
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (this.board[i][j] !== 0) {
                if (this.board[i][j - 1] === 0 || this.board[i][j - 1] === this.board[i][j]) {
                    return true
                }
            }
        }
    }
    return false
}

Game.prototype.canMoveRight = function () {
    // 右边是否有数字？右边数字是否和自己相等
    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            if (this.board[i][j] !== 0) {
                if (this.board[i][j + 1] === 0 || this.board[i][j + 1] === this.board[i][j]) {
                    return true
                }
            }
        }
    }
    return false
}

Game.prototype.canMoveUp = function () {
    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (this.board[i][j] !== 0) {
                if (this.board[i - 1][j] === 0 || this.board[i - 1][j] === this.board[i][j]) {
                    return true
                }
            }
        }
    }
}

Game.prototype.canMoveDown = function () {
    // 下边是否有数字？下边数字是否和自己相等
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
            if (this.board[i][j] !== 0) {
                if (this.board[i + 1][j] === 0 || this.board[i + 1][j] === this.board[i][j]) {
                    return true
                }
            }
        }
    }
    return false
}

// 水平能不能移动
Game.prototype.noBlockHorizontal = function (row, col1, col2) {
    for (let i = col1 + 1; i < col2; i++) {
        if (this.board[row][i] !== 0) {
            return false
        }
    }

    return true
}
// 垂直能不能移动
Game.prototype.noBlockVertical = function (column, row1, row2) {
    for (let i = row1 + 1; i < row2; i++) {
        if (this.board[i][column] !== 0) {
            return false
        }
    }
    return true
}


// 向左移动
Game.prototype.moveLeft = function () {
    const _this = this
    if (!this.canMoveLeft()) {
        return false
    }

    /*
     * moveLeft
     * 对每一个数字的左侧位置进行判断，看是否可能为落脚点
     * 1. 落脚点位置是否为空
     * 2. 落脚点位置数字和待判定元素数字相等
     * 3. 移动路径中是否有障碍物
     * */
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            // 当前位置的数字不是0，那就有可能移动
            if (this.board[i][j] !== 0) {
                // 遍历 当前元素 左边的 所有元素
                for (let k = 0; k < j; k++) {

                    /**
                     *  noBlockHorizontal(i, k, j, board)
                     *  第 i 行，从 k 列到 j 列，在board上，是否有障碍物
                     * */
                    if (this.board[i][k] === 0 && this.noBlockHorizontal(i, k, j)) {
                        // move
                        this.showMoveAnimation(i, j, i, k)
                        this.board[i][k] = this.board[i][j]
                        this.board[i][j] = 0
                        continue
                    } else if (this.board[i][k] === this.board[i][j] && this.noBlockHorizontal(i, k, j) && !this.hasConflicted[i][k]) {
                        // move
                        this.showMoveAnimation(i, j, i, k)

                        // 叠加
                        this.board[i][k] += this.board[i][j]
                        this.board[i][j] = 0
                        // 加分
                        this.score += this.board[i][k]
                        this.updateScore(this.score)

                        this.hasConflicted[i][k] = true
                        continue
                    }
                }
            }
        }
    }
    setTimeout(() => {
        _this.updateBoardView()
    }, 200);
    return true
}
// 向右移动
Game.prototype.moveRight = function () {
    const _this = this
    if (!this.canMoveRight()) {
        return false
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            if (this.board[i][j] !== 0) {
                for (let k = 3; k > j; k--) {
                    if (this.board[i][k] === 0 && this.noBlockHorizontal(i, j, k)) {
                        // move
                        this.showMoveAnimation(i, j, i, k)
                        this.board[i][k] = this.board[i][j]
                        this.board[i][j] = 0
                        continue
                    } else if (this.board[i][k] === this.board[i][j] && this.noBlockHorizontal(i, j, k) && !this.hasConflicted[i][k]) {
                        // move
                        this.showMoveAnimation(i, j, i, k)
                        // 叠加
                        this.board[i][k] += this.board[i][j]
                        this.board[i][j] = 0
                        // 加分
                        this.score += this.board[i][k]
                        this.updateScore(this.score)
                        this.hasConflicted[i][k] = true

                        continue
                    }
                }
            }
        }
    }
    setTimeout(() => {
        _this.updateBoardView()
    }, 200);
    return true
}

// 向上移动
Game.prototype.moveUp = function () {
    const _this = this
    if (!this.canMoveUp()) {
        return false
    }
    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (this.board[i][j] !== 0) {
                for (let k = 0; k < i; k++) {
                    if (this.board[k][j] === 0 && this.noBlockVertical(j, k, i)) {
                        this.showMoveAnimation(i, j, k, j)
                        this.board[k][j] = this.board[i][j]
                        this.board[i][j] = 0
                        continue
                    } else if (this.board[k][j] === this.board[i][j] && this.noBlockVertical(j, k, i) && !this.hasConflicted[k][j]) {
                        // move
                        this.showMoveAnimation(i, j, k, j)
                        // 叠加
                        this.board[k][j] += this.board[i][j]
                        this.board[i][j] = 0
                        // 加分
                        this.score += this.board[i][k]
                        this.updateScore(this.score)

                        this.hasConflicted[k][j] = true
                        continue
                    }
                }
            }
        }
    }
    setTimeout(() => {
        _this.updateBoardView()
    }, 200);
    return true
}


Game.prototype.moveDown = function () {
    const _this = this
    if (!this.canMoveDown()) {
        return false
    }
    // moveDown
    for (let j = 0; j < 4; j++)
        for (let i = 2; i >= 0; i--) {
            if (this.board[i][j] !== 0) {
                for (let k = 3; k > i; k--) {
                    if (this.board[k][j] === 0 && this.noBlockVertical(j, i, k)) {
                        // move
                        this.showMoveAnimation(i, j, k, j);
                        this.board[k][j] = this.board[i][j];
                        this.board[i][j] = 0;
                        continue;
                    } else if (this.board[k][j] === this.board[i][j] && this.noBlockVertical(j, i, k) && !this.hasConflicted[k][j]) {
                        // move
                        this.showMoveAnimation(i, j, k, j);
                        // add
                        this.board[k][j] += this.board[i][j];
                        this.board[i][j] = 0;
                        // add score
                        this.score += this.board[k][j];
                        this.updateScore(this.score);

                        this.hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout(() => {
        _this.updateBoardView()
    }, 200);
    return true;
}

Game.prototype.isGameOver = function () {
    if (this.noSpace() && this.noMove()) {
        this.gameOver()
    }
}


// TODO: 开始

var game = new Game();

game.init();
game.generateOneNumber()
game.generateOneNumber()

$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37:
            // left
            if (game.moveLeft()) {
                setTimeout('game.generateOneNumber()', 210);
                setTimeout('game.isGameOver()', 300);
            }
            break;
        case 38:
            // up
            if (game.moveUp()) {
                setTimeout('game.generateOneNumber()', 210);
                setTimeout('game.isGameOver()', 300);
            }
            break;
        case 39:
            // right
            if (game.moveRight()) {
                setTimeout('game.generateOneNumber()', 210);
                setTimeout('game.isGameOver()', 300);
            }
            break;

        case 40:
            // down
            if (game.moveDown()) {
                setTimeout(game.generateOneNumber.call(game), 210);
                setTimeout(game.isGameOver.call(game), 300);
            }
            break;
        default:
            // default
            break;
    }
})