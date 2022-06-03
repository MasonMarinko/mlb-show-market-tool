import React, {useState} from "react";

const Accordian = ({name, rating, sellNowPrice, buyNowPrice, moneyMake, img}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleAccordian = () => {
    setIsOpen(!isOpen)
  }
  
  // const { title, content } = accordionData;


  
  return (
<React.Fragment>
    <div className="accordion">
  <div onClick={e=>toggleAccordian()} className='flex-container'>
  <div className='card-info'>
    <div className='border-bottom-cards player-name card-info-spacing'>
    <span className="accordian-arrow">{isOpen ? "↓" : "↑" }</span> {name} {rating} {moneyMake}
    </div>
    <div className="accordion-title">
         {isOpen &&
         <>
         <img alt="baseball player card" className="card-image" src={img}></img>
         <div className='buy-sell-now-price card-info-spacing'>
           Buy Now Price: ${buyNowPrice}
         </div>
         <div className='buy-sell-now-price card-info-spacing'>
           Sell Now Price: ${sellNowPrice}
         </div>
         <div className="making-info-spacing">{moneyMake}</div>
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
  
  .accordion {
    max-width: 600px;
    margin: 2rem auto;
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
  
  @media screen and (max-width: 700px) {
    body {
      font-size: 18px;
    }
  
    .accordion {
      width: 90%;
    }
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
  
  .flex-container {
    cursor: pointer;
    display: flex;
    min-width: 29rem;
    margin-right: 4rem;
    margin-bottom: 2rem;
    border: outset;
    box-shadow: 0 10px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)
  }

  .accordian-arrow {
    display: flex;
    position: absolute;
    padding-left: 1rem;
  }
  
  .form-styling {
    width: 100%;
    padding-bottom: 5rem;
    text-align: center;
  }
  
  .flex-container:hover {
    transition: all 500ms ease-out;
    box-shadow: 0 30px 30px 0 rgb(0 0 0 / 20%), 0 30px 30px 0 rgb(0 0 0 / 19%)
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
  </React.Fragment>
);
};

export default Accordian;