import React, { useState, useEffect } from 'react';
import Accordian from './accordian';


export const getServerSideProps = async () => {
  const promises = []
  for (let i = 1; i < 5; i++) {
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
  const [buyNowPrice, setBuyNowPrice] = useState({})
  const [sellNowPrice, setSellNowPrice] = useState({})
  const [form, setForm] = useState({});
  const [areStatsOpen, setAreStatsOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isSold, setIsSold] = useState(false);
  const [refreshTime, setRefreshTime] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  setTimeout(() => {
    setRefreshTime(true);
  }, "60000")

  const gainLossCards = (buyPrice, sellPrice, isOpen) => {
    const commissionSellPrice = buyPrice - (buyPrice * .10)
    const buySellDifference = commissionSellPrice - sellPrice
    const breakEven = sellPrice / (.90)

    if (Math.sign(buySellDifference) === -1) {
      return (
        <div className="losing-container">
          {"Losing: " + '$' + Math.abs(buySellDifference).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
      )
    } else {
      return (
        <div>
          <p className="making-container">
            {"Making: " + '$' + Math.abs(buySellDifference).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
          <div className="bottom-border"></div>
          <p>
            Break Even Price
          </p>
          <p className="breakEven">Based off Current Prices <br /> DO NOT Sell for Less Than <br /><br /> <span className="breakEven-price">{"$" + breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></p>
        </div>
      )
    }
  }

  const onFieldChange = (e) => {
    if (e.target.name === "Buy Now Price") {
      setBuyNowPrice({
        ...buyNowPrice,
        [e.target.name]: e.target.value
      })
    } else {
      setSellNowPrice({
        ...sellNowPrice,
        [e.target.name]: e.target.value
      })
    }
  }

  const onSubmit = (e) => {
    e.preventDefault(e);
    setForm({
      "Buy Now Price": buyNowPrice["Buy Now Price"],
      "Sell Now Price": sellNowPrice["Sell Now Price"]
    })
    setAreStatsOpen(true)
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
    } else if (sellNowPrice["Final Sold Price"] && !buyNowPrice["Final Purchased Price"]) {
      setIsSold(true)
      setForm({
        "Sell Now Price": sellNowPrice["Final Sold Price"],
        "Buy Now Price": form["Buy Now Price"]
      })
    } else {
      setIsPurchased(true)
      setIsSold(true)
      setForm({
        "Buy Now Price": buyNowPrice["Final Purchased Price"],
        "Sell Now Price": sellNowPrice["Final Sold Price"]
      })
    }
  }

  const startOver = (e) => {
    e.preventDefault(e)
    setAreStatsOpen(false)
    setForm({})
  }

  useEffect(()=> {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    } else if (window.innerWidth > 768) {
      setIsMobile(false)
    }


    window.addEventListener('resize', ()=> {
      if(window.innerWidth < 768) {
        setIsMobile(true)
      } else if (window.innerWidth > 768) {
        setIsMobile(false)
      }
    })
 }, [])

  const gainLossHeader = (buyPrice, sellPrice) => {
    const commissionSellPrice = buyPrice - (buyPrice * .10)
    const buySellDifference = commissionSellPrice - sellPrice
    const breakEven = sellPrice / (.90)

    if (Math.sign(buySellDifference) === -1) {
      return (
        <div className="stats-container">
          <h1 className='border-bottom useful-title'>Useful Information:</h1>
          <div className="losing-container">
            <div className="entered-values-container">
              <h3 className="underline">Buy Now Entered:</h3><br />
              <p>${form["Buy Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              <h3 className="underline">Sell Now Entered:</h3>
              <p>${form["Sell Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            </div>
            <h3 className="title-padding-top">Money Lost (Based on buy/sell prices above)</h3>
            <div className="border-bottom"></div>
            <p className="losing-header">{"Losing: " + '$' + Math.abs(buySellDifference).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            <h3 className="title-padding-top">Recommendation</h3>
            <div className="border-bottom"></div>
            <p className="losing-header">{"DON'T buy at current inputted price of " + '$' + buyPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
          </div>
          <h2 className="update-info-title">Did you buy the card? Enter details of purchase here to update!</h2>
          <form className="form-styling" onSubmit={(e) => onPostPurchaseSubmit(e)}>
            <label className='input-labels buy-price'>
              Final Purchased Price:
              <input onChange={e => onPostPurchaseChange(e)} type="integer" name="Final Sold Price" />
            </label>
            <label className='input-labels sell-price'>
              Final Sold Price:
              <input onChange={e => onPostPurchaseChange(e)} type="integer" name="Final Purchased Price" />
              <input type="submit" value="Submit" />
            </label>
          </form>
          <button className="startOver-button" onClick={e => startOver(e)}>Start Over</button>
        </div>
      )
    } else {
      return (
        <div className="stats-container">
          <h1 className='border-bottom useful-title'>Useful Information:</h1>
          <div className="making-container">
            <div className="entered-values-container">
              <h3 className="underline">{isPurchased ? "Sold For Price" : "Buy Now Entered"}:</h3><br />
              <p>${form["Buy Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              <h3 className="underline">{isSold ? "Purchased Price" : "Sell Now Entered"}:</h3>
              <p>${form["Sell Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            </div>
            <h3 className="title-padding-top">Money Made</h3>
            <p className="parentheses-text">(Based on buy/sell prices above)</p>
            <div className='border-bottom'></div>
            <p className="making-header">{isPurchased ? "Made: " : "Making: "}{'$' + Math.abs(buySellDifference).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            {!isPurchased &&
              <>
                <h3 className="title-padding-top" >Recommendation</h3>
                <div className='border-bottom'></div>
                <p className="making-header">{"BUY at current inputted price of " + '$' + buyPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </>}
            <h3 className="title-padding-top breakEven">Break Even Price </h3>
            <p className="parentheses-text">(at currently entered price DO NOT sell for less than price below)</p>
            <div className='border-bottom'></div>
            <p className="breakEven-price">{"$" + breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
          </div>
          <h2 className="update-info-title">Did you buy the card? Enter details of purchase here to update!</h2>
          <form className="form-styling" onSubmit={(e) => onPostPurchaseSubmit(e)}>
            <label className='buy-price'>
              <span className="input-labels">
                Final Purchased Price:
              </span>
              <input onChange={e => onPostPurchaseChange(e)} type="integer" name="Final Sold Price" />
            </label>
            <label className='sell-price'>
              <span className="input-labels">
                Final Sold Price:
              </span>
              <input onChange={e => onPostPurchaseChange(e)} type="integer" name="Final Purchased Price" />
              <input type="submit" value="Submit" />
            </label>
            <div className="startOver-button-container">
              <button className="startOver-button" onClick={e => startOver(e)}>Start Over</button>
            </div>
          </form>
        </div>
      )
    }
  }


  return (
    <div>
      <div className="flex">
        <h1 className="main-title">Flip Calculator</h1>
        {!areStatsOpen && (
          <form className="form-styling" onSubmit={(e) => onSubmit(e)}>
            <label className='buy-price'>
              {!isMobile && <span className='input-labels'>Buy Now Price</span>}
              <input placeholder='Buy Now Price' onChange={e => onFieldChange(e)} type="integer" name="Buy Now Price" />
            </label>
            <br/>
            <label className='sell-price'>
            {!isMobile && <span className='input-labels'>Sell Now Price</span>}
              <input placeholder='Sell Now Price' onChange={e => onFieldChange(e)} type="integer" name="Sell Now Price" />
              <br />
              <br />
              <input className="submit-button" type="submit" value="Submit" />
            </label>
          </form>
        )}
        {areStatsOpen && (
          gainLossHeader(form["Buy Now Price"], form["Sell Now Price"])
        )}
        <h1 className="main-title">CARDS WITH OVER $1000 FLIP VALUE</h1>
        <h2 className='secondary-title'>{refreshTime === true && "CARD DATA OVER 1 MINUTE OLD, PLEASE CONSIDER REFRESHING PAGE"}</h2>
        <div className='refresh-button-container'>
          {refreshTime === true && <button className="refresh-button" onClick={e => window.location.reload()}>REFRESH</button>}
        </div>
        {resData?.map((r, i) =>
          <div className='flex-container' key={i}>
            <Accordian
            name={r.listing_name}
            rating={r.item.ovr}
            sellNowPrice={r.best_buy_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            buyNowPrice={r.best_sell_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            moneyMake={gainLossCards(r.best_sell_price, r.best_buy_price)}
            img={r?.item.img}
            />
            {/* <img alt="baseball player card" className="card-image" src={r?.item.img}></img>
            <div className='card-info'>
              <div className='border-bottom-cards player-name card-info-spacing'>
                {r.listing_name} ({r.item.ovr})
              </div>
              <div className='buy-sell-now-price card-info-spacing'>
                Buy Now Price: ${r.best_sell_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </div>
              <div className='buy-sell-now-price card-info-spacing'>
                Sell Now Price: ${r.best_buy_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </div>
              <div className="making-info-spacing">{gainLossCards(r.best_sell_price, r.best_buy_price)}</div>
            </div> */}
          </div>
        )}
      </div>
      <style jsx>{`
      #root {
        display: flex;
        flex-wrap: wrap;
      }
      
      .flex {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
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
        width: 100%;
        text-align: center;
      }
      
        .card-info-spacing {
            margin-bottom: .7rem;
        }
      
        .making-info-spacing {
            margin-top: 1.5rem;
        }
      
        .player-name {
            font-size: 1.7rem;
            font-weight: bold;
        }
        
        .buy-sell-now-price {
            margin-top: 1rem;
            font-size: 1.5rem
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
        margin-top: 0;
      }
      
      .making-container {
        padding: 0;
        margin: 0;
        padding-top:1rem;
        font-weight: bold;
        font-size:30px;
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
        font-size:30px;
        color:green;
      }
      
        .making-container h3 {
            color:black;
            margin-bottom: 0;
        }
      
      .breakEven {
        color: green;
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
      
      .making-container .breakEven {
        color: black;
      }
      
      .main-title {
        min-width: 100%;
        display: flex;
        justify-content: center;
        text-align: center;
        margin-bottom: 0;
        font-size: 34px;
      }
      
      .secondary-title {
        min-width: 100%;
        display: flex;
        justify-content: space-around;
        text-align: center;
        font-size: 18px;
        margin: 0;
        padding: 0 0 1rem 0;
        color: red;
      }
      
      .refresh-button-container {
        min-width: 100%;
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
      
      .breakEven .breakEven-price {
        color: green;
        text-decoration: none;
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
      `}</style>
    </div>
  );


}