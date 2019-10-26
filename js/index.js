const position = [
    [0,0],
    [1,0],
    [2,0],
    [0,1],
    [1,1],
    [2,1],
    [0,2],
    [1,2],
    [2,2]
]; 
//初始顺序
var orders = [0,1,2,3,4,5,6,7,8];

//容器
let content = document.querySelector('.content');
let originPositon = {}; //记录0-8号图片位置

//初始化
function init() {
    content.innerHTML = '';
    orders.forEach((item, index) => {
        let _position = position[item], //图片位置
            backgroundPosition = position[index]; //背景定位位置
        let dom = document.createElement('div');
        dom.className = `game position-${ backgroundPosition[0] }-${ backgroundPosition[1] }`;
        dom.style.left = `${ _position[0] * 100 }px`;
        dom.style.top = `${ _position[1] * 100 }px`;
        dom.style.backgroundPosition = `-${ backgroundPosition[0] * 100 }px -${ backgroundPosition[1] * 100 }px`;
        if(backgroundPosition[0] == 2 && backgroundPosition[1] == 2) {
            dom.style.backgroundImage = 'none';
        }
        //图片顺序 对应到的位置
        originPositon = Object.assign(originPositon, {
            [`${ backgroundPosition[0] }-${ backgroundPosition[1] }`]: [_position[0], _position[1]] 
        })
    //     console.log(JSON.stringify({            [`${ backgroundPosition[0] }-${ backgroundPosition[1] }`]: [_position[0], _position[1]] 
    // }), item)
        content.appendChild(dom);
    
    })
}

//动作
let action = {
    toL: function() {
        console.log('left');
        //查找可移动dom
        findWillMoveDoms();
        if(!willMoveDoms.right) {
            return;
        }
        let rightDom = document.querySelector(`.position-${willMoveDoms.right}`),
            blankDom = document.querySelector(`.position-2-2`);
        rightDom.style.left = `${ (originPositon[willMoveDoms.right][0] - 1) * 100 }px`;
        blankDom.style.left = `${ (originPositon['2-2'][0] + 1) * 100 }px`;
        originPositon[willMoveDoms.right][0]--;     
        originPositon['2-2'][0]++;     
        findWillMoveDoms();
    },
    toR: function() {
        console.log('right');
        //查找可移动dom
        findWillMoveDoms();
        if(!willMoveDoms.left) {
            return;
        }

        let leftDom = document.querySelector(`.position-${willMoveDoms.left}`),
            blankDom = document.querySelector(`.position-2-2`);
        leftDom.style.left = `${ (originPositon[willMoveDoms.left][0] + 1) * 100 }px`;
        blankDom.style.left = `${ (originPositon['2-2'][0] - 1) * 100 }px`;
        originPositon[willMoveDoms.left][0]++;     
        originPositon['2-2'][0]--;     
        findWillMoveDoms();
    },
    toB: function() {
        console.log('bottom');
        //查找可移动dom
        findWillMoveDoms();
        if(!willMoveDoms.top) {
            return;
        }
        let topDom = document.querySelector(`.position-${willMoveDoms.top}`),
            blankDom = document.querySelector(`.position-2-2`);
        topDom.style.top = `${ (originPositon[willMoveDoms.top][1] + 1) * 100 }px`;
        blankDom.style.top = `${ (originPositon['2-2'][1] - 1) * 100 }px`;
        originPositon[willMoveDoms.top][1]++;     
        originPositon['2-2'][1]--;   
        findWillMoveDoms();

    },
    toT: function() {
        console.log('top');
        //查找可移动dom
        findWillMoveDoms();
        if(!willMoveDoms.bottom) {
            return;
        }
        let bottomDom = document.querySelector(`.position-${willMoveDoms.bottom}`),
            blankDom = document.querySelector(`.position-2-2`);
        bottomDom.style.top = `${ (originPositon[willMoveDoms.bottom][1] - 1) * 100 }px`;
        blankDom.style.top = `${ (originPositon['2-2'][1] + 1) * 100 }px`;
        originPositon[willMoveDoms.bottom][1]--;     
        originPositon['2-2'][1]++;     
        findWillMoveDoms();

    }
}

//查询可移动doms
let willMoveDoms = {};
function findWillMoveDoms() {
    let blankDomPos = originPositon['2-2'];
    willMoveDoms = {};
    willMoveDoms.blank = '2-2';
    for(let i in originPositon) {
        let or = originPositon[i];
        if(or[0] == blankDomPos[0] && or[1] + 1 == blankDomPos[1]) {
            if(blankDomPos[1] == 0) {
                willMoveDoms.top = null;
            } else {
                willMoveDoms.top = i;
            }
        }
        if(or[0] == blankDomPos[0] && or[1] - 1 == blankDomPos[1]) {
            if(blankDomPos[1] == 2) {
                willMoveDoms.bottom = null;
            } else {
                willMoveDoms.bottom = i;
            }
        }
        if(or[1] == blankDomPos[1] && or[0] + 1 == blankDomPos[0]) {
            if(blankDomPos[0] == 0) {
                willMoveDoms.left = null;
            } else {
                willMoveDoms.left = i;
            }
        }
        if(or[1] == blankDomPos[1] && or[0] - 1 == blankDomPos[0]) {
            if(blankDomPos[0] == 2) {
                willMoveDoms.right = null;
            } else {
                willMoveDoms.right = i
            }
        }
    }
    // console.log(willMoveDoms, '可移动doms')
}

//随机生成拼图
function getPuzzle() {
    let newPuzzleArr = randomPuzzle();
    // console.log(newPuzzleArr);
    while(!checkPuzzle(newPuzzleArr)) {
        newPuzzleArr = randomPuzzle();
    }
    orders = [...newPuzzleArr, 8];

    init();
}

//随机生成拼图数组
function randomPuzzle() {
    let randomArr = [], origin = [0,1,2,3,4,5,6,7];
    while (randomArr.length < 8) {
        let index = Math.floor(Math.random() * origin.length), 
        num = origin[index];
        randomArr.push(origin[index]);
        origin.splice(index, 1);
    }
    return randomArr
}

//检测是否可以还原
function checkPuzzle(arr) {
    //计算逆序数 原数组逆序数为偶
    let count = 0, length = arr.length;
    for(let i = 0; i < length -1; i++) {
        if(arr[i] > arr[i+1]) {
            count++
        }
    }
    return count % 2 == 0
}



init();

document.querySelector('#game-reset').addEventListener('click', (e)=>{
    e.stopPropagation();
    getPuzzle()
})

document.addEventListener('keydown', (e)=>{
    e.stopPropagation();
    //左
    if(e.keyCode == 65) {
        action.toL();
    }
    //右
    if(e.keyCode == 68) {
        action.toR();
    }
    //上
    if(e.keyCode == 87) {
        action.toT();
    }
    //下
    if(e.keyCode == 83) {
        action.toB();
    }
})

EventUtil.listenTouchDirection(document, true, action);



