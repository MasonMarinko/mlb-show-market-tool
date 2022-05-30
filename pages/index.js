import React, { useState } from 'react';

export const getServerSideProps = async () => {
  const results = []
  for (let i=1; i < 8; i++) {
    const res = await fetch(
      `https://mlb22.theshow.com/apis/listings.json?&page=${i}`
      )
      const data = await res.json()
      results.push(data.listings)
  }
  return {
    props: {
      profitOnly: (results.flat(1).filter((r) => {
        const commissionSellPrice = r.best_sell_price - (r.best_sell_price * .10)
        const buySellDifference = commissionSellPrice - r.best_buy_price
        return buySellDifference > 1000 && r.best_buy_price !== 0
      }).map(p=>{
        const commissionSellPrice = p.best_sell_price - (p.best_sell_price * .10)
        const buySellDifference = commissionSellPrice - p.best_buy_price
        return ({...p, buySellDifference})
      }).sort((a, b) => b.buySellDifference - a.buySellDifference))
    }  
  }
}

export default function Home({profitOnly}) {
  const [resData, setResData] = useState(profitOnly)
  const [buyNowPrice, setBuyNowPrice] = useState({})
  const [sellNowPrice, setSellNowPrice] = useState({})
  const [form, setForm] = useState({});
  const [areStatsOpen, setAreStatsOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isSold, setIsSold] = useState(false);
  const [refreshTime, setRefreshTime] = useState(false);

  setTimeout(() => {
    setRefreshTime(true);
  }, "60000")

  const gainLossCards = (buyPrice, sellPrice) => {
    const commissionSellPrice = buyPrice - (buyPrice * .10)
    const buySellDifference = commissionSellPrice - sellPrice
    const breakEven = sellPrice/(.90)

    if (Math.sign(buySellDifference) === -1) {
      return (
        <div className = "losing-container">
          {"Losing: " + '$' + Math.abs(buySellDifference).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
      )
    } else {
      return (
        <div>
          <p className = "making-container">
          {"Making: " + '$' + Math.abs(buySellDifference).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
          <div className = "bottom-border"></div>
          <p>
          Break Even Price
          </p>
          <p className="breakEven">Based off Current Prices <br/> DO NOT Sell for Less Than <br/><br/> <span className = "breakEven-price">{ "$" + breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></p>
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
      if (!e.target.value){
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

  const gainLossHeader = (buyPrice, sellPrice) => {
    const commissionSellPrice = buyPrice - (buyPrice * .10)
    const buySellDifference = commissionSellPrice - sellPrice
    const breakEven = sellPrice/(.90)

    if (Math.sign(buySellDifference) === -1) {
      return (
        <div className = "stats-container">
           <h1 className='border-bottom useful-title'>Useful Information:</h1>
         <div className = "losing-container">
         <div className="entered-values-container">
           <h3 className="underline">Buy Now Entered:</h3><br/>
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
          <input onChange={e =>onPostPurchaseChange(e)} type="integer" name="Final Sold Price" />
        </label>
        <label className='input-labels sell-price'>
          Final Sold Price:
          <input onChange={e =>onPostPurchaseChange(e)}  type="integer" name="Final Purchased Price" />
          <input type="submit" value="Submit" />
          </label>
      </form>
         <button className="startOver-button" onClick={e =>startOver(e)}>Start Over</button>
       </div>
      )
    } else {
      return (
        <div className = "stats-container">
           <h1 className='border-bottom useful-title'>Useful Information:</h1>
         <div className = "making-container">
           <div className="entered-values-container">
           <h3 className="underline">{isPurchased ? "Sold For Price" : "Buy Now Entered"}:</h3><br/>
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
         <p className = "breakEven-price">{ "$" + breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</p>
         </div>
         <h2 className="update-info-title">Did you buy the card? Enter details of purchase here to update!</h2>
         <form className="form-styling" onSubmit={(e) => onPostPurchaseSubmit(e)}>
        <label className='buy-price'>
          <span className="input-labels">
          Final Purchased Price:
          </span>
          <input onChange={e =>onPostPurchaseChange(e)} type="integer" name="Final Sold Price" />
        </label>
        <label className='sell-price'>
          <span className="input-labels">
          Final Sold Price:
          </span>
          <input onChange={e =>onPostPurchaseChange(e)}  type="integer" name="Final Purchased Price" />
          <input type="submit" value="Submit" />
          </label>
          <div className="startOver-button-container">
         <button className="startOver-button" onClick={e =>startOver(e)}>Start Over</button>
         </div>
      </form>
       </div>
        )
    }
  }

  return (
    <div>
      <div className = "flex">
        <h1 className="main-title">Flip Calculator</h1>
        {!areStatsOpen && (
      <form className="form-styling" onSubmit={(e) => onSubmit(e)}>
        <label>
          <span className='input-labels'>Buy Now Price</span>
          <input onChange={e =>onFieldChange(e)} type="integer" name="Buy Now Price" />
        </label>
        <label className='sell-price'>
          <span className='input-labels'>Sell Now Price</span>
          <input onChange={e =>onFieldChange(e)} type="integer" name="Sell Now Price" />
          <br/>
          <br/>
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
    {profitOnly?.map((r,i) =>
      <div className='flex-container' key={i}>
        <img alt="baseball player card" className="card-image" src={r?.item.img}></img>
        <div className='card-info'>
          <div className='border-bottom-cards player-name card-info-spacing'>
            {r.listing_name}
          </div>
          <div className='buy-sell-now-price card-info-spacing'>
            Buy Now Price: ${r.best_sell_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
          <div className='buy-sell-now-price card-info-spacing'>
            Sell Now Price: ${r.best_buy_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
          <div className="making-info-spacing">{gainLossCards(r.best_sell_price, r.best_buy_price)}</div>
        </div>
      </div>
    )}
    </div>
    </div>
    );


  }