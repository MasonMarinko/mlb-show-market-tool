import React, {useState} from "react";

const Accordian = ({name, rating, sellNowPrice, buyNowPrice, moneyMake, playerTeam, breakEven, img}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const teamHex = [
    {
      team: "Diamondbacks",
      hex: "#a71e31",
      hex2: "#3fc2cc"
    },
    {
      team: "Orioles",
      hex: "#dd4926",
      hex2: "#b3b5b7"
    },
    {
      team: "Cubs",
      hex: "#cc3433",
      hex2: "#273b81"
    },
    {
      team: "Reds",
      hex: "#c62127",
      hex2: "#FFFFFF"
    },
    {
      team: "Rockies",
      hex: "#37246b",
      hex2: "#c4ced3"
    },
    {
      team: "Braves",
      hex: "#16284f",
      hex2: "#ce1f43"
    },
    {
      team: "Red Sox",
      hex: "#bd3139",
      hex2: "#192c55"
    },
    {
      team: "White Sox",
      hex: "#c4ced3",
      hex2: "#ffffff"
    },
    {
      team: "Guardians",
      hex: "#e21d38",
      hex2: "#1a2e5a"
    },
    {
      team: "Tigers",
      hex: "#182d55",
      hex2: "#f26722"
    },
    {
      team: "Astros",
      hex: "#1e3160",
      hex2: "#ea6e24"
    },
    {
      team: "Angels",
      hex: "#ba2026",
      hex2: "#1a3561"
    },
    {
      team: "Marlins",
      hex: "#00A3E0",
      hex2: "#EF3340"
    },
    {
      team: "Twins",
      hex: "#1a2e5a",
      hex2: "#cfac7a"
    },
    {
      team: "Yankees",
      hex: "#c4ced3",
      hex2: "#122448"
    },
    {
      team: "Royals",
      hex: "#c0995a",
      hex2: "#174885"
    },
    {
      team: "Dodgers",
      hex: "#005a9c",
      hex2: "#ef3e42"
    },
    {
      team: "Brewers",
      hex: "#b5922f",
      hex2: "#1a2550"
    },
    {
      team: "Mets",
      hex: "#ff5910",
      hex2: "#002D72"
    },
    {
      team: "Athletics",
      hex: "#eeb21e",
      hex2: "#013831"
    },
    {
      team: "Phillies",
      hex: "#284999",
      hex2: "#e71d2a"
    },
    {
      team: "Padres",
      hex: "#1e3160",
      hex2: "#ffffff"
    },
    {
      team: "Mariners",
      hex: "#0e4d8c",
      hex2: "#025d5d"
    },
    {
      team: "Rays",
      hex: "#1b2f5b",
      hex2: "#90bce4"
    },
    {
      team: "Blue Jays",
      hex: "#124b8d",
      hex2: "#e72c25"
    },
    {
      team: "Pirates",
      hex: "#fdb724",
      hex2: "#000000"
    },
    {
      team: "Giants",
      hex: "#f15b28",
      hex2: "#000000"
    },
    {
      team: "Cardinals",
      hex: "#c4203b",
      hex2: "#22205f"
    },
    {
      team: "Rangers",
      hex: "#c02126",
      hex2: "#233974"
    },
    {
      team: "Nationals",
      hex: "#aa1e22",
      hex2: "#212759"
    }
  ]


  const toggleHelpText = () => {
    setIsHelpOpen(!isHelpOpen);
  }

  const getTeamColor = (playerTeam) => {
    return teamHex.find(team => team.team === playerTeam).hex
  }

  const getTeamColor2 = (playerTeam) => {
    return teamHex.find(team => team.team === playerTeam).hex2
  }

  const toggleOverlay = (e) => {
    if (e?.target?.className.includes('info-icon')) {
      return
    } else {
      setIsOverlay(!isOverlay)
      setIsHelpOpen(false);
    }
  }

  return (
    <React.Fragment>
    <div className="accordian">
      {isOverlay && <div onClick={e=>toggleOverlay(e)} className="dark-overlay">
        <div className="overlay-container">
          <div className="overlay-img-container">
        <img className="overlay-card" src={img}></img>
          </div>
          <div className="overlay-data-container">
            <div className="background-box">
            <div className="buy-now">
              <div className="header-background">
         <div className='text-header card-info-spacing overlay-text'>Buy Now Price:</div>
         </div>
         <div className="card-info-spacing overlay-text">${buyNowPrice}</div>
         </div>
         <div className="buy-now">
         <div className="header-background">
         <div className='text-header card-info-spacing overlay-text'>Sell Now Price:</div>
         </div>
         <div className="card-info-spacing overlay-text">${sellNowPrice}</div>
         </div>
         <div className="buy-now">
         <div className="header-background">
         <div className='text-header card-info-spacing overlay-text'>Break Even:</div><button type="button" onClick={e=>toggleHelpText(e)} className="info-icon">!</button>
         {isHelpOpen && <div className="help-text">If card was bought for ${sellNowPrice} (the current purchase price) this represents the lowest you should sell the card for to break even after the 10% commission.<br/><br/>
         <span className = "math-title">MATH BREAKDOWN:</span><br/>
         <div className="equation-title"> &nbsp;${breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (Break Even) <br/> <span className="equation-underline">- 10% (Commission)</span>= ${sellNowPrice} (What was paid)</div></div>}


         </div>
         <div className="card-info-spacing overlay-text">{"$" + breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
         </div>
         <div className="buy-now">
         <div className="header-background">
         <div className='text-header card-info-spacing overlay-text'>Making:</div>
         </div>
         <div className="card-info-spacing making-container overlay-text">{'$' + Math.abs(moneyMake).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
         </div>
            </div>
          </div>
        </div>
      </div>}
  <div onClick={e=>toggleOverlay()} className='flex-container'>
  <div className='card-info'>
    <div className={`${isOpen && "border-bottom-cards"} player-name card-info-spacing`}>
        <div>{name} ({rating}) </div>
        <div className="spacer"></div>
        {!isOpen && <div className="making-container">{"Making: " + '$' + Math.abs(moneyMake).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>}
    </div>
    <div>
         {isOpen &&
         <>
         <div>
         <div className='card-info-spacing'>
           Buy Now Price: ${buyNowPrice}
         </div>
         <div className='card-info-spacing'>
           Sell Now Price: ${sellNowPrice}
         </div>
         <div className="making-container">
            {"Making: " + '$' + Math.abs(moneyMake).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
          </div>
         </>
         }
        </div>
  </div>
</div>
<style jsx>{`

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 20px;
    background: rgb(238, 174, 202);
    background: radial-gradient(
      circle,
      rgba(238, 174, 202, 1) 0%,
      rgba(199, 233, 148, 1) 100%
    );
  }
  
  h1 {
    text-align: center;
    margin: 2rem 0 4rem 0;
  }
  
  .accordian-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    cursor: pointer;
  }
  
  .accordian-title,
  .accordian-content {
    padding: 1rem;
  }
  
  .accordian-content {
    background-color: #39b9d2;
  }
  
  @media screen and (max-width: 700px) {
    body {
      font-size: 18px;
    }
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .header-background {
    background-color: black;
    width: 208px;
    border-radius: 15px 15px 0 0;
    height: 30px;
    justify-content: center;
    display: flex;
    align-items: end;
  }
  
  .sell-price input {
    min-width: 15rem;
    min-height: 2rem;
  }
  
  .buy-price input {
    margin-bottom: 2rem;
    min-width: 15rem;
    min-height: 2rem;
  }
  
  .flex-container {
    width: 100%;
    cursor: pointer;
    min-width: 25rem;
    display: flex;
    margin-bottom: 3rem;
    border: outset;
    border-radius: 20px;
    box-shadow: 0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)
  }

  .help-text {
    position: absolute;
    background-color: white;
    width: 23rem;
    margin-bottom: 1.5rem;
    border-radius: 15px;
    padding: .5rem;
    border: 2px solid black;
    font-size: 1.5rem;
  }
  
  .math-title {
    display: flex;
    font-size: 2.0rem;
    justify-content: center;
    font-weight: bold;
    text-decoration: underline;
  }

  .data-overlay {
    font-size: 16rem;
  }

  .text-header {
    color: white;
  }

  .equation-title {
    display: flex;
    flex-wrap: wrap;
    justify-content: right;
    padding-right: 3rem;
  }

  .overlay-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  
  .overlay-card {
    max-height: 20rem;
    box-shadow: 0px 0px 25px 20px ${getTeamColor(playerTeam)};
  }
  
  .overlay-img-container {
    justify-content: center;
    align-items: end;
    display: flex;
    width: 100%;
  }

  .overlay-data-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  .overlay-text {
    display: flex;
  }

  .equation-underline {
    text-decoration: underline;
  }

  .info-icon {
    color: white;
    border: 2px solid white;
    border-radius: 60%;
    display: flex;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: black;
    align-items: center;
    cursor: pointer;
    position: absolute;
    margin-left: 10rem;
    margin-bottom: .4rem;
    font-weight: bold;
    z-index: 1;
  }

  .buy-now {
    border-radius: 20px;
    border: .2rem black solid;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .sell-now {
    display: flex;
    justify-content: center;
  }

  .money-make {
    display: flex;
    justify-content: center;
  }

  .background-box {
    margin-top: 3rem;
    max-height: 22rem;
    max-width: 15rem;
    box-shadow: 0px 0px 25px 15px ${getTeamColor2(playerTeam)};
    border: 3px outset ${getTeamColor(playerTeam)};
    padding: 15px;
    background: white;
    background-clip: padding-box;
    border-radius: 15px;
  }

  .dark-overlay {
    background-color: rgba(0, 0, 0, 0.75);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
    .accordian-arrow {
      display: flex;
      position: absolute;
      padding-left: 2rem;
    }

  
  .form-styling {
    width: 100%;
    padding-bottom: 5rem;
    text-align: center;
  }
  
  .flex-container:hover {
    transition: all 500ms ease-out;
    box-shadow: 0px 0px 25px 5px ${getTeamColor(playerTeam)};
  }
  
  .money-back {
    font-size:10px;
  }
  
  .cart-image {
    align-self: center;
  }
  
  .card-info {
    width: 100%;
    text-align: center;
    border-radius: 20px;
  }

  .card-info-spacing {
        font-weight: bold;
        font-size: 1.5rem;
        text-align: center;
  } 
  
    .making-info-spacing {
        margin-top: 1.5rem;
    }
  
    .player-name {
        font-size: 1.7rem;
        font-weight: bold;
    }
  
    .border-bottom-cards {
        border-bottom: 1px solid black;
    }
  
  h2 {
    margin-bottom:0;
    padding-top: 1rem;
  }
  
  .stats-container {
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 3rem;
    text-align: center;
  }
    .stats-container h1 {
        font-size: 50px;
    }
  
  
  .breakEven-price {
    color: green;
    text-decoration: none;
  }

  .break-even-title {
    font-size: 2.2rem;
  }
  
  .losing-container {
    padding: 0;
    margin: 0;
    font-weight: bold;
    font-size:30px;
    color:red;
  }
    .losing-container h3 {
        color:black;
        margin-bottom: 0;
    }
  
  
  .making-container {
    padding: 0;
    margin: 0;
    font-weight: bold;
    font-size: 30px;
    color: green;
    text-align: center;
  }
  
    .making-container h3 {
        color:black;
        margin-bottom: 0;
    }
  
  .breakEven {
    color: green;
    font-size: 1.1rem;
    padding-top: 2rem;
  }
  
  .border-bottom {
    border-bottom: 1px solid black;
    margin: 0 600px 0 600px;
  }
  
  .timer-data {
    font-size: 20px;
  }
  
  .underline {
    text-decoration: underline;
  }
  
  .useful-title {
    margin-bottom: 40px;
  }
  
  .main-title {
    display: flex;
    justify-content: center;
    text-align: center;
    margin-bottom: 0;
    font-size: 34px;
  }
  
  .secondary-title {
    display: flex;
    justify-content: space-around;
    text-align: center;
    font-size: 18px;
    margin: 0;
    padding: 0 0 1rem 0;
    color: red;
  }
  
  .refresh-button-container {
    display: flex;
    justify-content: space-around;
    padding: 0 0 2.5rem 0;
    margin: 0;
  }
  
  .title-padding-top {
    padding-top: 3rem;
    margin: 0px;
  }
  
  .entered-values-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
    .entered-values-container h3 {
        margin-top: 0;
        padding-right: 1rem;
    }
  
    .entered-values-container p {
        align-items: center;
        margin: 0;
        padding-right:4rem;
    }
  
  .refresh-button {
    margin-top:0;
    padding: 10px 40px 10px 40px;
  }
  
  .form-styling {
    padding-top: 15px;
    padding-bottom: 50px;
    border-bottom: solid 1px black;
  }
  
    .submit-button {
        padding: 10px 50px 10px 50px;
    }
    .input-labels {
        padding-right: 1rem;
    }
  
  .update-info-title {
    padding-top: 75px;
  }
  
  .startOver-button-container {
    min-width: 100%;
  }
  
  .startOver-button {
    margin-top: 2rem;
    padding: 10px 50px 10px 50px;
  }
  
  .parentheses-text {
    font-size: 1.2rem;
    margin-top: 0px;
    color: black;
    margin:0 0 5px 0;
  }
  
  .losing-header {
    padding: 0;
    margin: 0;
    font-weight: bold;
    font-size:30px;
    color:red;
  }
  
  .making-header {
    padding: 0;
    margin: 0;
    font-weight: bold;
    font-size:30px;
    color:green;
  }
  
  .bottom-border{
    border-bottom: solid thin darkGray;
    padding-top: 2rem;
  }


  ====== Zoom-out effect ======

*/
.mfp-zoom-out {
  
  /* start state */
  .mfp-with-anim {
    opacity: 0;
    transition: all 0.3s ease-in-out; 
    transform: scale(1.3); 
  }
  
  &.mfp-bg {
    opacity: 0;
	  transition: all 0.3s ease-out;
  }
  
  /* animate in */
  &.mfp-ready {
    .mfp-with-anim {
      opacity: 1;
      transform: scale(1); 
    }
    &.mfp-bg {
      opacity: 0.8;
    }
  }
  
  /* animate out */
  &.mfp-removing {
    
    .mfp-with-anim {
      transform: scale(1.3); 
      opacity: 0;
    }
    &.mfp-bg {
      opacity: 0;
    }
    
  }
  
}

`}</style>
    </div>
  </React.Fragment>
);
};

export default Accordian;