import React, { useEffect } from "react";
import "./CartPage.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeFromCart,
  clearCart,
} from "../../store/cartSlice";
import { formatPrice } from "../../utils/helpers";
import styled from "styled-components";

const ContactBox = styled.div`
  @media only screen and (max-width: 800px) {
    justify-content: space-between;
  }
`;

const ImgContainer = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 10px;
  @media only screen and (max-width: 576px) {
    width: 90vw;
    height: 150px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;

    @media only screen and (max-width: 576px) {
    
    }
  }
`;

const CartPage = () => {
  const dispatch = useDispatch();
  const {
    data: cartProducts,
  } = useSelector((state) => state.cart);

  console.log(cartProducts)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const emptyCartMsg = <h4 className="text-red fw-6">No items found!</h4>;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="breadcrumb">
          <ul className="breadcrumb-items flex">
            <li className="breadcrumb-item">
              <Link to="/">
                <i className="fas fa-home"></i>
                <span className="breadcrumb-separator">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li>Saved Items</li>
          </ul>
        </div>
      </div>
      <div className="bg-ghost-white py-5">
        <div className="container">
          <div className="section-title bg-ghost-white">
            <h3 className="text-uppercase fw-7 text-regal-blue ls-1">
              Products
            </h3>
          </div>
          {cartProducts.length === 0 ? (
            emptyCartMsg
          ) : (
            <div className="cart-content grid">
              <div className="cart-left">
                <div className="cart-items grid">
                  {cartProducts.map((cartProduct) => (
                    <div className="cart-item grid" key={cartProduct.prodID}>
                      <div className="cart-item-img flex flex-column bg-white">
                        <Link
                          to={`/category/${cartProduct.categories[0]}?prodID=${cartProduct.prodID}`}
                        >
                          <ImgContainer bgImage={cartProduct.images[0]}>
                            <img
                              src={cartProduct.images[0]}
                              alt={cartProduct.productName}
                            />
                          </ImgContainer>
                        </Link>
                        <button
                          type="button"
                          className="btn-square rmv-from-cart-btn"
                          onClick={() =>
                            dispatch(removeFromCart(cartProduct.id))
                          }
                        >
                          <span className="btn-square-icon">
                            <i className="fas fa-trash"></i>
                          </span>
                        </button>
                      </div>

                      <div className="cart-item-info">
                        <h6 className="fs-16 fw-5 text-light-blue">
                          {cartProduct.productName}
                        </h6>
                      
                        <div className="flex flex-between">
                          <div className="text-pine-green fw-4 fs-15 price">
                            Price : {formatPrice(cartProduct.productPrice)}
                          </div>
                     
                        </div>
                        <ContactBox className="flex">
                          <span className="text-light-blue qty-text">
                            Seller Contact:{" "}
                          </span>
                          {cartProduct.seller.number}
                        </ContactBox>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => dispatch(clearCart())}
                >
                  <span className="fs-16">Clear Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
