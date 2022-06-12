import React, { useState } from 'react';
import Accordion from './accordion';


export const getServerSideProps = async () => {
  const promises = []
  for (let i = 1; i < 72; i++) {
    const p = new Promise((resolve, reject) => {
      fetch(`https://mlb22.theshow.com/apis/listings.json?&page=${i}`)
        .then(res => res.json())
        .then(data => {
          resolve(data.listings)
        })
        .catch(err => reject(err))
    })
    promises.push(p)
  }
  const listings = await Promise.all(promises)
  const results = listings.reduce((acc, curr) => [...acc, ...curr], [])
  return {
    props: {
      profitOnly: (results.flat(1).filter((r) => {
        const commissionSellPrice = r.best_sell_price - (r.best_sell_price * .10)
        const buySellDifference = commissionSellPrice - r.best_buy_price
        return buySellDifference > 1000 && r.best_buy_price !== 0
      }).map(p => {
        const commissionSellPrice = p.best_sell_price - (p.best_sell_price * .10)
        const buySellDifference = commissionSellPrice - p.best_buy_price
        return ({ ...p, buySellDifference })
      }).sort((a, b) => b.buySellDifference - a.buySellDifference))
    }
  }
}

export default function Home({ profitOnly }) {
  const [resData, setResData] = useState(profitOnly)
  const [buyNowPrice, setBuyNowPrice] = useState({"Buy Now Price": "0"})
  const [sellNowPrice, setSellNowPrice] = useState({"Sell Now Price": "0"})
  const [form, setForm] = useState({});
  const [areStatsOpen, setAreStatsOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [noBuyNow, setNoBuyNow] = useState(false);
  const commissionSellPrice = form["Buy Now Price"] - (form["Buy Now Price"] * .10)
  const buySellDifference = commissionSellPrice - form["Sell Now Price"]
  const breakEven = form["Sell Now Price"] / (.90)

  const breakEvenPrice = (bestBuyPrice) => {
    return bestBuyPrice/(.90)
  }

  const gainLossCards = (buyPrice, sellPrice) => {
    const commissionSellPrice = buyPrice - (buyPrice * .10)
    return commissionSellPrice - sellPrice
  }

  const toggleHelpText = () => {
    setIsHelpOpen(!isHelpOpen);
  }

  const onFieldChange = (e) => {
    if (e.target.name === "Buy Now Price") {
      if (e.target.value === "") {
        setBuyNowPrice({"Buy Now Price": "0"})
      } else {
          setBuyNowPrice({
            ...buyNowPrice,
            [e.target.name]: e.target.value
          })
   }} else {
      setSellNowPrice({
        ...sellNowPrice,
        [e.target.name]: e.target.value
      })
    }
  }

  const onSubmit = (e) => {
    e.preventDefault(e);
    if (sellNowPrice["Sell Now Price"] === "0") {
      setNoBuyNow(true)
      setBuyNowPrice({ "Buy Now Price": "0" })
      alert("Sell Now Price is REQUIRED")
      return
    } else if (buyNowPrice["Buy Now Price"] === "0") {
      setNoBuyNow(true)
      setAreStatsOpen(true)
      setForm({
        "Sell Now Price": sellNowPrice["Sell Now Price"],
        "Buy Now Price": "0"
      })  
    } else {
      setNoBuyNow(false)
      setAreStatsOpen(true)
      setForm({
        "Buy Now Price": buyNowPrice["Buy Now Price"],
        "Sell Now Price": sellNowPrice["Sell Now Price"]
      })
    }
  }

  const onPostPurchaseChange = (e) => {
    if (e.target.name === "Final Purchased Price") {
      setBuyNowPrice({
        ...buyNowPrice,
        "Final Purchased Price": e.target.value
      })
    } else {
      if (!e.target.value) {
        return
      } else {
        setSellNowPrice({
          ...sellNowPrice,
          [e.target.name]: e.target.value
        })
      }
    }
  }

  const onPostPurchaseSubmit = (e) => {
    e.preventDefault(e);
    
    if (!buyNowPrice["Final Purchased Price"] && !sellNowPrice["Final Sold Price"]) {
      return
    } else if (buyNowPrice["Final Purchased Price"] && !sellNowPrice["Final Sold Price"]) {
      setNoBuyNow(false)
      setForm({
        "Buy Now Price": buyNowPrice["Final Purchased Price"],
        "Sell Now Price": form["Sell Now Price"]
      })
      setNoBuyNow(false)
    } else if (sellNowPrice["Final Sold Price"] && !buyNowPrice["Final Purchased Price"]) {
      setNoBuyNow(true)
      setForm({
        "Sell Now Price": sellNowPrice["Final Sold Price"],
        "Buy Now Price": form["Buy Now Price"]
      })
    } else {
      setNoBuyNow(false)
      setForm({
        "Buy Now Price": buyNowPrice["Final Purchased Price"],
        "Sell Now Price": sellNowPrice["Final Sold Price"]
      })
    }
  }

  const startOver = (e) => {
    e.preventDefault(e)
    setBuyNowPrice({"Buy Now Price": "0"})
    setSellNowPrice({"Sell Now Price": "0"})
    setAreStatsOpen(false)
    setForm({})
  }

  return (
    <div id="root">
      <div className="flex">
        <div className="upper-outer-container">
          <div className="upper-inner-container">
            <div className="flip-img-text-container">
          <img className="mobile-calc-heading" src="https://i.imgur.com/b2rFbLh.png"></img>
        <h1 className="main-title">
        <span className="flip-calc-title">Flip Calculator</span> <div className = "icon-container"><button type="button" onClick={e=>toggleHelpText(e)} className="info-icon">!</button></div></h1>
        </div>
        {isHelpOpen && <div onClick={e => toggleHelpText(e)} className="help-container">
          <div className="help-text">In MLB The Show, you can submit Buy and Sell Orders. <br/><br/> When you see {`"`}Buy Now{`"`}, you{`'`}re actually seeing the lowest available price that someone has posted as a {`"`}Sell Order{`"`}. <br/><br/>Alternately, if you see {`"`}Sell Now{`"`}, you{`'`}re
          looking at the cheapest amount someone is posting they will pay on their {`"`}Buy Order{`"`}. <br/><br/> For more information, checkout <a href="https://www.youtube.com/watch?v=ZfSel0u1Ws0">this video.</a></div>
         </div>}
        
        {!areStatsOpen && (
          <form className="form-styling" onSubmit={(e) => onSubmit(e)}>
            <label className="buy-price">
              <input className = "inputs-style" placeholder='Buy Now Price (For more info, click "i" icon)' onChange={e => onFieldChange(e)} type="number" name="Buy Now Price" />
            </label>
            <br/>
            <label className="sell-price">
              <input className = "inputs-style" placeholder='Sell Now Price (For more info, click "i" icon)' onChange={e => onFieldChange(e)} type="number" name="Sell Now Price" />
              <br />
              <br />
              <input className="submit-button" type="submit" value="Submit" />
            </label>
          </form>
        )}
        {areStatsOpen && (
          <div className="stats-container">
          <div className="losing-container">
            <div className="entered-values-container">
              <div className="stat-border buy-now-margin left-items buy-now-left">
              <h1 className="title-padding entered-titles ">Buy Now Entered</h1>         
              <p className="result-text">${form["Buy Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0}</p>
              </div>
              <div className="stat-border">
              <h1 className="title-padding entered-titles">Sell Now Entered</h1>
              <p className="result-text">${form["Sell Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </div>
            </div>
            <div className="entered-values-container">
            {noBuyNow === false && <div className="stat-border left-items background-color">
              <h1 className="entered-titles title-padding">{Math.sign(buySellDifference) === -1 ? "Expected Loss" : "Expected Profit"}</h1>
              <div className="border-bottom"></div>
              <p className="result-text">{Math.sign(buySellDifference) === -1 ? "$" + Math.abs(buySellDifference).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "$" + Math.abs(buySellDifference).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            </div>}
            {noBuyNow === false && 
            <div className="stat-border background-color">
            <h1 className="entered-titles title-padding">Recommendation</h1>
            <div className="border-bottom"></div>
            <p className="result-text">{buySellDifference < 1000 ? "DON'T BUY" : "BUY"}</p>
            </div>}
            </div>
          </div>
          {/* {Math.sign(buySellDifference) === -1 && noBuyNow !== && */}
          <div className="stat-border-single">
           <h1 className="title-padding ">Break Even Price </h1>
             <p className="result-text">{"$" + breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            </div>
            {/* } */}
          <div className="purchase-input-title">
          <h2 className="update-info-title">Card prices change?</h2>
          <h2 className="update-info-title">Enter new details here to get new calculations!</h2>
          </div>
          <form className="form-styling" onSubmit={(e) => onPostPurchaseSubmit(e)}>
            <div className="input-container">
            <label className="input-labels buy-price">
              <div className="input-contain">
              <input className="inputs-style" onChange={e => onPostPurchaseChange(e)} placeholder="Buy Now Price" type="number" name="Final Purchased Price" />
              </div>
            </label>
            <label className='input-labels buy-price'>
              <div className="input-contain">
              <input className="inputs-style" onChange={e => onPostPurchaseChange(e)} placeholder="Sell Now Price" type="number" name="Final Sold Price" />
              </div>
              <div className="buttons-container">
              <div className="button-direct-container">
              <input className="submit-button" type="submit" value="Submit" />
              </div>
            <div className="button-direct-container">
          <button className="startOver-button" onClick={e => startOver(e)}>Start Over</button>
          </div>
          </div>
            </label>
            </div>
          </form>
          </div>
        )}
        </div>
        </div>
        <div className="border-top flip-title-container">
        <img className="mobile-flip-heading" src="https://i.imgur.com/b2rFbLh.png"></img>
        <h1 className="main-title-flip"><a>Money Makers</a></h1>
        <h3 className="more-info">Click cards below for more info</h3>
        </div>
        {resData?.map((r, i) =>
          <div className="accordion-container" key={i}>
            <Accordion
            name={r.listing_name}
            rating={r.item.ovr}
            sellNowPrice={r.best_buy_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            buyNowPrice={r.best_sell_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            moneyMake={gainLossCards(r.best_sell_price, r.best_buy_price)}
            breakEven={breakEvenPrice(r.best_buy_price)}
            playerTeam={r.item.team}
            img={r?.item.img}
            />
          </div>
        )}
      </div>
      <style jsx global>{`
        body {
          margin: 0;
          background-color: #141922;
        }
      `}</style>
      <style jsx>{`
      #root {
        font-family: roboto, sans-serif;
        height: 100% !important;
        display: flex;
      }
      .submit-button {
        background-color: darkgrey;
        min-width: 15rem;
        min-height: 4rem;
        border-radius: 10px;
      }
      .mobile-calc-heading {
          padding-bottom: 1rem;
      }
      .mobile-flip-heading {
        display: none;
      }
      .submit-button:hover {
        background-color: grey;
      }
      .buy-now-margin {
        margin-right: ${noBuyNow ? "1rem" : "0"};
      }
      .upper-outer-container {
        display: flex;
        min-width: 100%;
        justify-content: space-around;
        background-color: #b91d1e;
        padding-bottom: 5rem;
        margin-bottom: -20px;
        background-image: url("https://i.imgur.com/D7avbDZ.jpg");
        background-position-x: -1066px;
        background-position-y: -90px;
      }
      .upper-inner-container {
        min-width: 500px;
      }
      .flex {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: space-around;
      }
      .info-icon {
        color: white;
        display: ${!isHelpOpen ? "none": "block"};
        border: 2px solid white;
        border-radius: 60%;
        display: flex;
        background-color: black;
        cursor: pointer;
        font-weight: bold;
        font-size: 1rem;
        justify-content: center;
        align-items: center;
        position: absolute;
        margin-top: -1.2rem;
        margin-right: -.3rem;
      }
      .icon-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      .flip-calc-title {
        position: absolute;
        min-width: 32rem;
        font-size: 59px;
        color: black;
        margin-top: -5.6rem;
        margin-right: 5.9rem;
      }
      
      .losing-container {
        display: flex;
      }
      
      input {
        margin-bottom: 2rem;
        min-width: 27rem;
        min-height: 3rem;
        font-size: 21px;
      }
      .form-styling {
        text-align: center;
      }
      .startOver-button {
        min-width: 15rem;
          min-height: 4rem;   
          font-size: 21px;
          background-color: darkgrey;
          border-radius: 10px;
      }
      .result-text {
        font-size: 1.5rem;
        font-weight: bold;
        display: flex;
        flex-wrap: wrap;
        max-width: 14rem;
        justify-content: center;
        overflow-wrap: anywhere;
      }
      h1 {
        font-size: 1.5rem;
      }
      .update-info-title {
        margin: 0;
        color: white;
        font-size: 1.2rem;
      }
      .entered-values-container .background-color {
        background-color: ${buySellDifference < 1000 ? "red": "green"};
      }
      .input-contain {
        display: flex;
        min-height: 2rem;
        margin-top: .5rem;
        justify-content: space-around;
      }
      .input-container {
        display: flex;
        flex-wrap: wrap;
        max-width: 30rem;
        justify-content: space-around;
      }
      .purchase-input-title {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1rem;
        justify-content: center;
        text-align: center;
        max-width: 27rem;
      }
      .title-padding {
        margin-top: 0;
        border-radius: 15px 15px 0 0;
        background-color: black;
        color: white;
      }
      .entered-values-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      .stats-container {
        justify-content: center;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
      }
      .stat-border {
        border: 1px solid black;
        border-radius: 15px;
        min-width: 14rem;
        text-align: center;
        margin-top: 1rem;
        background-color: lightgrey;
        border-radius: 17px;
      }
      .stat-border-single {
        border: 1px solid black;
        border-radius: 15px;
        min-width: 14rem;
        text-align: center;
        margin-top: 1rem;
        background-color: lightgrey;
        border-radius: 17px;
      }
      .main-title {
        color: white;
        min-width: 100%;
        justify-content: center;
        text-align: center;
        margin-top: 1rem;
        margin-bottom: ${areStatsOpen ? "0": "1rem"};
        font-size: 4rem;
        display: flex;
        padding-bottom: 1rem;
      }

      .border-top {
        border-top: 4px double white;
        width: 100%;
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

      .help-container {
        position: fixed;
        top: 33px;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: start;
      }

      .main-title-flip {
        min-width: 100%;
        display: flex;
        justify-content: center;
        text-align: center;
        margin-top: 0;
        margin-bottom: 0;
        font-size: 4rem;
        padding-top: 2rem;
        color: white;
      }

      .more-info {
        color: white;
        margin-top: 0;
        display: flex;
        justify-content: center;
      }
      .inputs-style {
        margin-bottom: 1rem;
        min-width: 27rem;
        min-height: 3rem;
        font-size: 21px;
    }
    .buttons-container {
      display: flex;
      justify-content: space-around;
    }
      @media screen and (min-width: 690px) {
        .info-icon {
          margin-top: 4.3rem;
          margin-right: 31rem;
        }
        .flip-img-text-container {
          min-width: 500px;
        }
        .main-title-flip {
          position: absolute;
          color: green;
          font-size: 58px;
          margin-right: 5.9rem;
          margin-top: 5.8rem;
        }
        .main-title {
          color: white;
          margin-top: 1rem;
          font-size: 4rem;
          display: flex;
          padding-bottom: 1rem;
        }
        .mobile-flip-heading {
          display: block;
        }
        .mobile-calc-heading {
          padding-bottom: 1rem;
          display: none;
      }
        .upper-outer-container {
          display: flex;
          background-color: #b91d1e;
          padding-bottom: 5rem;
          margin-bottom: -20px;
          background-image: url("https://i.imgur.com/D7avbDZ.jpg");
          image-width: 100%;
          background-repeat: no-repeat;
          justify-content: flex-end;
          background-size: cover;
          background-position-x: 0;
          background-position-y: -3rem;
        }
        .upper-inner-container {
          min-width: 500px;
        }
        .image-header {
          position: absolute;
        }
        .input-contain {
          display: flex;
          min-height: 2rem;
          margin-top: 1rem;
          justify-content: space-around;
        }
        .flip-title-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 7rem;
          padding-top: 5rem;
        }
        .main-title-flip {
          display: flex;
        }
        .more-info {
          position: absolute;
          margin-top: 12rem;

        }
        .flip-calc-title {
          position: unset;
          margin-top: 0;
          margin-right: 0;
          font-size: 63px;
        }
        
        .inputs-style {
            margin-bottom: 2rem;
            min-width: 27rem;
            min-height: 3rem;
            font-size: 21px;
        }

        .startOver-button {
          min-width: 10rem;
          min-height: 4rem;   
          font-size: 21px;
          background-color: lightgrey;
          border-radius: 15px;
        }

        .submit-button {
          background-color: lightgrey;
          min-width: 10rem;
          min-height: 4rem;
          border-radius: 15px;
          margin-bottom: 0;
        }

        .submit-button:hover {
          background-color: darkgrey;
        }
        
        .startOver-button:hover {
          background-color: darkgrey;
        }

        .stats-container {
              max-width: 41rem;
        }

        .purchase-input-title {
          margin-top: 3rem;
        }

        .buttons-container {
          display: flex;
          width: 400px;
          justify-content: space-around;
        }

        input {
          margin-bottom: 1rem;
            min-width: 0;
            min-height: 0;   
            font-size: 21px;
        }

        .button-direct-container {
          display: flex;
        }
      }
      
     @media screen and (min-width: 690px) {
        #root {
          justify-content: center;
        }
     }

      `}</style>
    </div>
  );
}