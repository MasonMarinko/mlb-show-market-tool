import React, {useState, useEffect} from "react";

const Accordion = ({name, rating, sellNowPrice, buyNowPrice, moneyMake, playerTeam, breakEven, img, setIsAccOpen}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
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
      hex: "#122448",
      hex2: "#c4ced3"
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
    },
    {
      team: "Free Agents",
      hex: "#808080",
      hex2: "#ffffff"
    }
  ]

  
  const toggleHelpText = (e) => {
    if (e.target.name === "help-icon") {
      setIsHelpOpen(!isHelpOpen);
    }
  }
  
  const getTeamColor = (playerTeam) => {
    return teamHex.find(team => team.team === playerTeam)?.hex 
  }
  
  const getTeamColor2 = (playerTeam) => {
    return teamHex.find(team => team.team === playerTeam)?.hex2
  }
  
  const toggleAccordion = (e) => {
    if (e.target.name === "help-icon") {
      setIsAccordionOpen(true);
    } else {
      setIsAccordionOpen(!isAccordionOpen);
      setIsHelpOpen(false)
    }
  }

  return (
    <React.Fragment>
    <div className="accordion">
  <div className={isAccordionOpen ? "flex-container" : "other-flex-container"} onClick={e=>toggleAccordion(e)}>
  <div className="card-info">
    <div className= 'player-name card-info-spacing'>
        <div className="name-rating-container">
        <div className="name-rating-text">{name} ({rating}) </div>
        <div className="spacer"></div>
        {!isAccordionOpen && <div className="making-container">{"Making: " + "$" + Math.abs(moneyMake).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>}
    </div>
    {!isAccordionOpen ? <div className="accordion-arrow">{`>`}</div>:<div className="accordion-arrow-2">{`^`}</div>}
    </div>
          <div>
        {isAccordionOpen &&     
        <div className="dark-overlay">
        <div className="overlay-container">
          <div className="overlay-img-container">
        <img className="overlay-card" src={img}></img>
          </div>
          <div className="overlay-data-container">
            <div className="background-box">
            <div className="buy-now">
              <div className="header-background">
         <div className="text-header card-info-spacing overlay-text">Buy Now Price:</div>
         </div>
         <div className="card-info-spacing overlay-text">${buyNowPrice}</div>
         </div>
         <div className="buy-now">
         <div className="header-background">
         <div className="text-header card-info-spacing overlay-text">Sell Now Price:</div>
         </div>
         <div className="card-info-spacing overlay-text">${sellNowPrice}</div>
         </div>
         <div className="buy-now">
         <div className="header-background">
         <div className="text-header card-info-spacing overlay-text">Break Even:<button type="button" onClick={e=>toggleHelpText(e)} name = "help-icon" className="info-icon">!</button></div>
         <div className="help-container">
         {isHelpOpen && <div className="help-text">If card was bought for ${sellNowPrice} (the current purchase price) this represents the lowest you should sell the card for to break even after the 10% commission.<br/><br/>
         <span className = "math-title">MATH BREAKDOWN:</span><br/>
         <div className="equation-title"> &nbsp;${breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (Break Even) <br/> <span className="equation-underline">- 10% (Commission)</span>= ${sellNowPrice} (What was paid)</div></div>}
         </div>
         </div>
         <div className="card-info-spacing overlay-text">{"$" + breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
         </div>
         <div className="buy-now">
         <div className="header-background">
         <div className="text-header card-info-spacing overlay-text">Making:</div>
         </div>
         <div className="card-info-spacing making-container overlay-text">{"$" + Math.abs(moneyMake).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
         </div>
            </div>
          </div>
        </div>
        </div>}
      </div>
  </div>
</div>
<style jsx>{`
  .flex-container {
    background: lightgray;
    color: white;
    min-width: 28rem;
    min-height: 72px;
    justify-content: center;
    display: flex;
    margin-bottom: 3rem;
    background-color: #fffffff;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)
  }

  .other-flex-container {
    background: lightgray;
    color: white;
    -webkit-tap-highlight-color: transparent;
    min-width: 28rem;
    min-height: 72px;
    justify-content: center;
    display: flex;
    margin-bottom: 3rem;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    border-radius: 8px;
    box-shadow: 0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)
  }

  .other-flex-container:hover {
    background: linear-gradient(70.88deg, ${getTeamColor2(playerTeam)} 7.16%, ${getTeamColor(playerTeam)} 15.16%,lightgrey 15.89%);
    background-size: 125%;
    animation: closed-gradient 1s forwards;
    box-shadow: rgba(80, 63, 205, 0.5) 0 1px 30px;
  }

  @keyframes closed-gradient {
    0% {
      background-position: 100% 0%;
    }
    50% {
      background-position: 100% 20%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .flex-container:hover {
    background: linear-gradient(70.88deg, ${getTeamColor2(playerTeam)} 16.16%, ${getTeamColor(playerTeam)} 30.16%,lightgrey 15.89%);
    background-size: 158%;
    animation: open-gradient 1s forwards;
    box-shadow: rgba(80, 63, 205, 0.5) 0 1px 30px;
  }
  
  @keyframes open-gradient {
    0% {
      background-position: 100% 0%;
    }
    50% {
      background-position: 100% 20%;
    }
    100% {
      background-position: 0% 50%;
    }
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
    background-color: black;
    border-radius: 15px 15px 0 0;
  }

  .help-text {
    position: absolute;
    background-color: white;
    width: 23rem;
    border-radius: 15px;
    padding: .5rem;
    z-index: 1;
    border: 2px solid black;
    font-size: 1.5rem;
    margin-left: -11rem;
    margin-top: -0.5rem;
    color: black;
  }

  .equation-title {    
    display: flex;
    justify-content: end;
    padding-right: 3rem;
    flex-wrap: wrap;
  }

  .overlay-container {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  
  .overlay-img-container {
    align-self: center;
    display: flex;
    padding: 10px;
  }

  .overlay-data-container {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
  }
  
  .overlay-card {
    max-height: 20rem;
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
    width: 22px;
    height: 22px;
    background-color: black;
    cursor: pointer;
    position: absolute;
    margin-left: 10.1rem;
    font-weight: bold;
    z-index: 1;
    margin-top: 0.1rem;
  }

  .buy-now {
    border: 1px solid black;
    border-radius: 15px;
    min-width: 12rem;
    margin-bottom: 1.7rem;
  }

  .sell-now {
    display: flex;
    justify-content: center;
  }

  .money-make {
    display: flex;
    justify-content: center;
  }
  
  .accordion {
    display: flex;
    justify-content: center;
  }

  .accordion-arrow {
    align-self: center;
    position: absolute;
    margin-right: 24rem;
  }

  .accordion-arrow-2 {
    align-self: center;
    position: absolute;
    margin-right: 24rem;
    transform: rotate(180deg);
    margin-top: 1rem;
  }

  .name-rating-text {
    color: black;
    padding-bottom: 4px;
    ${isAccordionOpen && "font-size:35px"}
  }
  
  .form-styling {
    width: 100%;
    padding-bottom: 5rem;
    text-align: center;
  }
  
  .money-back {
    font-size:10px;
  }
  
  .cart-image {
    align-self: center;
  }
  
  .card-info {
    text-align: center;
    border-radius: 20px;
    display: unset;
  }

  .card-info-spacing {
        font-weight: bold;
        font-size: 1.5rem;
        text-align: center;
        justify-content: center;
  } 
  
    .making-info-spacing {
        margin-top: 1.5rem;
    }
  
    .player-name {
        font-size: 1.7rem;
        font-weight: bold;
        display: flex;
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
  
  .bottom-border {
    border-bottom: solid thin darkGray;
    padding-top: 2rem;
  }
  @media screen and (max-width: 751px) {
    h1 {
      text-align: center;
      margin: 2rem 0 4rem 0;
    }
    .flex-container {
      -webkit-tap-highlight-color: transparent;
    }
    
    .accordion-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      cursor: pointer;
    }
    
    .accordion-title,
    .accordion-content {
      padding: 1rem;
    }
    
    .accordion-content {
      background-color: #39b9d2;
    }
  
    .header-background {
      background-color: black;
      border-radius: 15px 15px 0 0;
    }
    
    .sell-price input {
      min-width: 15rem;
      min-height: 2rem;
    }

    .accordion-arrow {
      display: none;
    }
  
    .accordion-arrow-2 {
      display: none;
    }
    
    .buy-price input {
      margin-bottom: 2rem;
      min-width: 15rem;
      min-height: 2rem;
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
  
    .help-text {
      position: absolute;
      background-color: white;
      width: 23rem;
      z-index: 1;
      border-radius: 15px;
      padding: .5rem;
      border: 2px solid black;
      font-size: 1.5rem;
      margin-right: -11rem;
      margin-bottom: 2rem;
    }
    
    .help-container {
      position: fixed;
      top: 33px;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .equation-title {    
      display: flex;
      justify-content: end;
      padding-right: 3rem;
      flex-wrap: wrap;
    }
  
    .overlay-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: center;
    }
    
    .overlay-card {
      max-height: 20rem;
      box-shadow: 0px 0px 25px 20px ${getTeamColor(playerTeam)};
      border: 5px double ${getTeamColor2(playerTeam)};
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
  
    .equation-underline {
      text-decoration: underline;
    }
  
    .buy-now {
      border: 1px solid black;
      border-radius: 15px;
      min-width: 12rem;
      margin-bottom: 1.7rem;
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
      padding-top: 30px;
      margin-top: 3rem;
      max-height: 22rem;
      max-width: 15rem;
      box-shadow: 0px 0px 25px 15px ${getTeamColor2(playerTeam)};
      border: 3px outset ${getTeamColor(playerTeam)};
      padding: 15px;
      background: lightgrey;
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
    
    .bottom-border {
      border-bottom: solid thin darkGray;
      padding-top: 2rem;
    }
  }
`}</style>
    </div>
  </React.Fragment>
);
};

export default Accordion;