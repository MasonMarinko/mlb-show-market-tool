import React, { useState, useEffect } from 'react';
import Accordion from './accordion';
import Head from 'next/head';                                                                                                                                                                                                         



export const getServerSideProps = async () => {
  const promises = []
  for (let i = 1; i < 20; i++) {
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

  const breakEven = (bestBuyPrice) => {
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
    if (buyNowPrice["Final Purchased Price"] && !sellNowPrice["Final Sold Price"]) {
      setIsPurchased(true)
      setForm({
        "Buy Now Price": buyNowPrice["Final Purchased Price"],
        "Sell Now Price": form["Sell Now Price"]
      })
      setNoBuyNow(false)
    } else if (sellNowPrice["Final Sold Price"] && !buyNowPrice["Final Purchased Price"]) {
      setForm({
        "Sell Now Price": sellNowPrice["Final Sold Price"],
        "Buy Now Price": form["Buy Now Price"]
      })
    } else {
      setIsPurchased(true)
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

  const gainLossHeader = (buyPrice, sellPrice) => {
    const commissionSellPrice = buyPrice - (buyPrice * .10)
    const buySellDifference = commissionSellPrice - sellPrice
    const breakEven = sellPrice / (.90)

      return (
        <div className="stats-container">
          <div className="losing-container">
            <div className="entered-values-container">
              <div className="stat-border left-items buy-now-left">
              <h1 className="title-padding entered-titles ">Buy Now Entered</h1>         
              <p className="result-text">${form["Buy Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0}</p>
              </div>
              <div className="stat-border">
              <h1 className="title-padding entered-titles">Sell Now Entered</h1>
              <p className="result-text">${form["Sell Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </div>
            </div>
            <div className="entered-values-container">

            {noBuyNow === false && <div className="stat-border left-items">
              <h1 className="entered-titles title-padding">{Math.sign(buySellDifference) === -1 ? "Expected Loss" : "Expected Profit"}</h1>
              <div className="border-bottom"></div>
              <p className="result-text">{Math.sign(buySellDifference) === -1 ? "Losing: $" + Math.abs(buySellDifference).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "Making: $" + Math.abs(buySellDifference).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
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
              <input onChange={e => onPostPurchaseChange(e)} placeholder="Buy Now Price" type="number" name="Final Purchased Price" />
              </div>
            </label>
            <label className='input-labels buy-price'>
              <div className="input-contain">
              <input onChange={e => onPostPurchaseChange(e)} placeholder="Sell Now Price" type="number" name="Final Sold Price" />
              </div>
              <div className="input-contain">
              <input className="submit-button" type="submit" value="Submit" />
              </div>
            <div className="input-contain">
          <button className="startOver-button" onClick={e => startOver(e)}>Start Over</button>
          </div>
            </label>
            </div>
          </form>
          <style jsx>{`
          input {
            margin-bottom: 1rem;
              min-width: 15rem;
              min-height: 2rem;
              
          }
          .left-items {
            margin-right: 0;
          }
          .result-text {
            font-size: 1.2rem;
            display: flex;
            flex-wrap: wrap;
            max-width: 14rem;
            justify-content: center;
          }
          button {
            margin-bottom: 1rem;
            min-width: 15rem;
            min-height: 2rem;
          }
          h1 {
            font-size: 1.5rem;
          }
          .update-info-title {
            margin: 0;
          }
          .submit-button {
            margin: 0;
          }
          .background-color {
            background-color: ${buySellDifference < 1000 ? "red": "green"};
          }
          .input-contain {
            display: flex;
            min-width: 15rem;
            min-height: 2rem;
            margin-top: 1rem;
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
            margin-top: 3rem;
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
            justify-content: space-around;
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
          }
          .stat-border-single {
            border: 1px solid black;
            border-radius: 15px;
            min-width: 14rem;
            text-align: center;
            margin-top: 1rem;
          }
          @media screen and (min-width: 690px) {
            .stats-container {
                  max-width: 41rem;
              }
              .left-items {
                ${!isPurchased ? "margin-right: 1rem;":null}
              }
              .buy-now-left {
                margin-right: 1rem;
              }
          }
           `}</style>
        </div>
      )
    } 

  return (
    <div id="root">
      <div className="flex">
        <h1 className="main-title">
        <img src="https://i.imgur.com/b2rFbLh.png"></img><span className="flip-calc-title">Flip Calculator</span> <div className = "icon-container"><button type="button" onClick={e=>toggleHelpText(e)} className="info-icon">!</button></div></h1>

        {isHelpOpen && <div onClick={e => toggleHelpText(e)} className="help-container">
          <div className="help-text">In MLB The Show, you can submit Buy and Sell Orders. <br/><br/> When you see {`"`}Buy Now{`"`}, you{`'`}re actually seeing the lowest available price that someone has posted as a {`"`}Sell Order{`"`}. <br/><br/>Alternately, if you see {`"`}Sell Now{`"`}, you{`'`}re
          looking at the cheapest amount someone is posting they will pay on their {`"`}Buy Order{`"`}. <br/><br/> For more information, checkout <a href="https://www.youtube.com/watch?v=ZfSel0u1Ws0">this video.</a></div>
         </div>}
        
        {!areStatsOpen && (
          <form className="form-styling" onSubmit={(e) => onSubmit(e)}>
            <label className="buy-price">
              <input placeholder='Buy Now Price (For more info, click "i" icon)' onChange={e => onFieldChange(e)} type="number" name="Buy Now Price" />
            </label>
            <br/>
            <label className="sell-price">
              <input placeholder='Sell Now Price (For more info, click "i" icon)' onChange={e => onFieldChange(e)} type="number" name="Sell Now Price" />
              <br />
              <br />
              <input className="submit-button" type="submit" value="Submit" />
            </label>
          </form>
        )}
        {areStatsOpen && (
          gainLossHeader(form["Buy Now Price"], form["Sell Now Price"])
        )}
        <h1 className="border-top main-title-flip">Top Flip Cards</h1>
        <div className="refresh-button-container">
        </div>
        {resData?.map((r, i) =>
          <div className="accordion-container" key={i}>
            <Accordion
            name={r.listing_name}
            rating={r.item.ovr}
            sellNowPrice={r.best_buy_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            buyNowPrice={r.best_sell_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            moneyMake={gainLossCards(r.best_sell_price, r.best_buy_price)}
            breakEven={breakEven(r.best_buy_price)}
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
        justify-content: unset ;
      }
      .flex {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }

      .info-icon {
        color: white;
        display: ${!isHelpOpen ? "none": "block"};
        border: 2px solid white;
        border-radius: 60%;
        display: flex;
        width: 30px;
        height: 30px;
        background-color: black;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.6rem;
        justify-content: center;
        align-items: center;
        position: absolute;
        margin-top: 12rem;
        margin-right: 31rem;
      }
      .icon-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      .flip-calc-title {
        position: absolute;
        min-width: 100%;
        font-size: 53px;
        margin-top: 7.9rem;
        margin-right: 7.7rem;
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
      .main-title {
        color: white;
        min-width: 100%;
        justify-content: center;
        text-align: center;
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 4rem;
        display: flex;
        padding-bottom: 4rem;
      }

      .border-top {
        border-top: 2px solid black;
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
        margin-top: 5rem;
        margin-bottom: 1rem;
        font-size: 4rem;
        padding-top: 2rem;
      }
      
      .refresh-button-container {
        min-width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 0 0 2.5rem 0;
        margin: 0;
      }
     @media screen and (min-width: 690px) {
        #root {
          justify-content: center;
        }
        input {
          margin-bottom: 2.2rem;
        }
        .flip-calc-title {
          font-size: 55px;
        }
     }

      `}</style>
    </div>
  );
}