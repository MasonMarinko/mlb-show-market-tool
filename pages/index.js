import React, { useState, useEffect } from 'react';
import Accordian from './accordian';
import { useRouter } from 'next/router';


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
  const [componentRefreshed, setComponentRefreshed] = useState(false);
  const [refreshClicked, setRefreshClicked] = useState(false);
  const router = useRouter()
  
  const checkData =  (e) => {
    router.replace(router.asPath)
    setResData(profitOnly)
  }

  const breakEven = (bestBuyPrice) => {
    return bestBuyPrice/(.90)
  }

  const gainLossCards = (buyPrice, sellPrice) => {
    const commissionSellPrice = buyPrice - (buyPrice * .10)
    return commissionSellPrice - sellPrice
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



// VERIFY LOGIC ONCE FUNCTION UPDATED


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



// ============================================================



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

      return (
        <div className="stats-container">
          <div className="losing-container">
            <div className="entered-values-container">
              <div className="stat-border">
              <h1 className="title-padding entered-titles">Buy Now Entered</h1>
              <p>${form["Buy Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </div>
              <div className="stat-border">
              <h1 className="title-padding entered-titles">Sell Now Entered</h1>
              <p>${form["Sell Now Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </div>
            </div>
            <div className="entered-values-container">
            <div className="stat-border">
            <h1 className="entered-titles title-padding">{Math.sign(buySellDifference) === -1 ? "Money Lost" : "Money Made"}</h1>
            <div className="border-bottom"></div>
            <p className="net-header">{Math.sign(buySellDifference) === -1 ? "Losing:"  + "$" + Math.abs(buySellDifference).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : (isPurchased ? "Made: " : "Making: ") + "$" + Math.abs(buySellDifference).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            </div>
            <div className="stat-border">
            <h1 className="entered-titles title-padding">Recommendation</h1>
            <div className="border-bottom"></div>
            <p className="suggestion-header">{Math.sign(buySellDifference) === -1 ? "DON'T buy at " + '$' + buyPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " or higher" : "BUY at " + '$' + buyPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " or lower"}</p>
            </div>
          </div>
          </div>
        {Math.sign(buySellDifference) === 1 &&
          <>
          <div className="stat-border-single">
           <h1 className="title-padding ">Break Even Price </h1>
             <p className="breakEven-price">{"$" + breakEven.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            </div>
          </>}
          <div className="purchase-input-title">
          <h2 className="update-info-title">Purchase a card?</h2>
          <h2 className='update-info-title'>Enter Details here to get new calculations!</h2>
          </div>
          <form className="form-styling" onSubmit={(e) => onPostPurchaseSubmit(e)}>
            <div className="input-container">
            <label className='input-labels buy-price'>
              <div className="input-contain">
              <input onChange={e => onPostPurchaseChange(e)} placeholder="Final Purchased Price" type="integer" name="Final Sold Price" />
              </div>
            </label>
            <label className='input-labels sell-price'>
              <div className="input-contain">
              <input onChange={e => onPostPurchaseChange(e)} placeholder="Final Sold Price" type="integer" name="Final Purchased Price" />
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
            justify-content: space-around;
          }
          .purchase-input-title {
            display: flex;
            flex-wrap: wrap;
            margin-top: 3rem;
            justify-content: center;
            text-align: center;
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
            width: 41rem;
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
           `}</style>
        </div>
      )
    } 




  return (
    <div>
      <div className="flex">
        <h1 className="main-title">Flip Calculator</h1>
        {!areStatsOpen && (
          <form className="form-styling" onSubmit={(e) => onSubmit(e)}>
            <label className='buy-price'>
              <input placeholder='Buy Now Price' onChange={e => onFieldChange(e)} type="integer" name="Buy Now Price" />
            </label>
            <br/>
            <label className='sell-price'>
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
        <h1 className="border-top main-title-flip">Top Flip Cards</h1>
        <div className='refresh-button-container'>
        </div>
        {resData?.map((r, i) =>
          <div className='flex-container' key={i}>
            <Accordian
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
      <style jsx>{`
      #root {
        display: flex;
        flex-wrap: wrap;
      }
      
      .flex {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
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
        text-align: center;
      }
      .main-title {
        min-width: 100%;
        display: flex;
        justify-content: center;
        text-align: center;
        margin-top: 1rem;
        margin-bottom: 2.5rem;
        font-size: 4rem;
      }

      .border-top {
        border-top: 2px solid black;
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
      `}</style>
    </div>
  );


}