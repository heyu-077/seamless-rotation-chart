// 配置对象
const config = {
  imgWidth: 520,
  dotWidth: 12,
  doms: {
    divBanner: document.querySelector(".banner"),
    divImgs: document.querySelector(".banner .images"),
    divDots: document.querySelector(".banner .dots"),
    divArrow: document.querySelector(".banner .arrow"),
  },
  currentIndex:0,
  timer:{  //运动的计时器
    duration:16, //运动间隔的时间
    total: 1000, //运动总时间
    id: null 
  },
  autoTimer: null //自动移动的计时器
};
config.imgNumber = config.doms.divImgs.children.length;

/**
 * 初始化元素尺寸
 */
function initSize() {
  config.doms.divImgs.style.width = config.imgWidth * (config.imgNumber + 2) + "px";
  config.doms.divDots.style.width = config.dotWidth * config.imgNumber + "px";
}

/**
 * 初始化元素
 */
function initElements(){
   //创建小圆点
   for(let i=0; i<config.imgNumber; i++){
       let span=document.createElement('span');
       config.doms.divDots.appendChild(span);
   }
   //复制图片
   const children=config.doms.divImgs.children;
   const first=children[0], last=children[children.length-1];
   const newImg1=first.cloneNode(true);
   config.doms.divImgs.appendChild(newImg1);
   const newImg2=last.cloneNode(true);
   config.doms.divImgs.insertBefore(newImg2,first);
}

/**
 * 初始化图片位置
 */
function initPosition(){
   const left=(-config.currentIndex-1)*config.imgWidth;
   config.doms.divImgs.style.marginLeft=left+'px';
}

/**
 * 设置小圆点状态
 */
function setDotStatus(){
   for(let i=0; i<config.doms.divDots.children.length; i++){
        let dot=config.doms.divDots.children[i];
        if(i === config.currentIndex){
          dot.className='active';
        }else{
          dot.className='';
        }
   }
}

/**
 * 初始化所有初始方法
 */
function init(){
  initSize();
  initElements();
  initPosition();
  setDotStatus();
}
init();

/**
 * 切换到某一图片的索引
 * @param {*} index 
 * @param {*} direction 图片移动方向
 */
function switchTo(index,direction){
    if(index === config.currentIndex) return;
    if(!direction){
      direction='left';
    }
    //最终的marginLeft
    const newLeft=(-index-1)*config.imgWidth;
    animateSwich();

    //重新设置索引
    config.currentIndex=index;
    setDotStatus();

    /**
     * 逐步改变marginLeft
     */
    function animateSwich(){
       stopAnimate(); //先停止之前的动画;

       // 1.计算运动的次数
       const number=Math.ceil(config.timer.total / config.timer.duration);
       let curNumder=0; //当前的运动次数；

       // 2.计算总距离
       let distance;
       let marginLeft=parseFloat(getComputedStyle(config.doms.divImgs).marginLeft);
       const totalWidth=config.imgWidth * config.imgNumber;
       if(direction === 'left'){
          if(newLeft < marginLeft){
              distance = newLeft - marginLeft;
          }else{
              distance = -(totalWidth - Math.abs(newLeft - marginLeft))
          }
       }else{
        if(newLeft > marginLeft){
          distance = newLeft - marginLeft;
         }else{
          distance = totalWidth - Math.abs(newLeft - marginLeft);
         }
       }

       //3.计算每次移动距离
       const everyDistance=distance / number;

       config.timer.id=setInterval(()=>{
         //改变div的marginLeft
           marginLeft+=everyDistance;
           if(direction === 'left' && Math.abs(marginLeft) > totalWidth){
             marginLeft += totalWidth;
           }else if(direction === 'right' && Math.abs(marginLeft)< config.imgWidth){
             marginLeft -= totalWidth;
           }
           config.doms.divImgs.style.marginLeft=marginLeft+'px';
           curNumder++;
           if(number === curNumder){
             stopAnimate();
           }  
       },config.timer.duration);
    }
    
    /**
     * 停止计时器
     */
    function stopAnimate(){
       clearInterval(config.timer.id);
       config.timer.id=null;
    }
}

config.doms.divArrow.onclick = function(e) {
  if(e.target.classList.contains('left-arrow')){
      toLeft();
  } else if(e.target.classList.contains('right-arrow')){
      toRight()
  }
}

config.doms.divDots.onclick=function(e){
  if(e.target.tagName === 'SPAN'){
    const index = Array.from(this.children).indexOf(e.target);
    console.log(index);
    switchTo(index, index>config.currentIndex ? 'left' : 'right');
  }
}

/**
 * 图片向左移动
 */
function toLeft(){
  let index = config.currentIndex - 1;
  if(index < 0){
    index = config.imgNumber - 1;
  }
  switchTo(index, 'right');
}

/**
 * 图片向右移动
 */
function toRight(){
  let index =(config.currentIndex + 1) % config.imgNumber;
  switchTo(index, 'left');
}

//自动移动设置
config.autoTimer = setInterval(toRight,2000);

config.doms.divBanner.onmouseenter = function(){
  clearInterval(config.autoTimer);
  config.autoTimer = null;
}

config.doms.divBanner.onmouseleave = function(){
  if(config.autoTimer){
     return;
  }
  config.autoTimer = setInterval(toRight,2000);
}


