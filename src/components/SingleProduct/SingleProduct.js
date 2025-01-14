/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./SingleProduct.scss";
import { useSelector, useDispatch } from "react-redux";
import { setIsModalVisible } from "../../store/modalSlice";
import { addToCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/helpers";
import styled from "styled-components";
import { no_image } from "../../utils/images";
import queryString from "query-string";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../base";

const ImageContainer = styled.div`
  overflow: hidden;
  height: 75vw;
  display: flex;
  position: relative;

  img {
    object-fit: cover;
    min-width: 100%;
    max-width: 100%;
    height: 100%;
    transition: all 0.2s;
    transform: ${(props) => `translateX(${-1 * props.offSet}%)`};
  }

  > div {
    position: absolute;
    z-index: 100;
    top: 50%;
    font-size: 30px;
    font-weight: 400;
    color: #606060;
    padding: 20px;
    background-color: #ffffff96;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transform: translateY(-50%);
  }

  > .right-arrow {
    right: 0px;
  }

  > .left-arrow {
    left: 0px;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionContainer = styled.div`
  display: flex;
  column-gap: 10px;
  flex-wrap: wrap;
  width: 100%;

  button {
    min-width: 170px;
    flex: 1;
  }

  @media only screen and (max-width: 600px) {
  }
`;
const SingleProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { data: product } = useSelector((state) => state.modal);
  const [imgOffSet, setImgOffSet] = useState(0);
  const [hasCopied, setHasCopied] = useState(false);

  const queryParams = queryString.parse(window.location.search);
  const { prodID } = queryParams;

  useEffect(() => {
    const docRef = doc(db, "products", prodID);

    if (product.analytics) {
      // console.log(product);
      const views = product.analytics.views + 1;
      setDoc(docRef, { analytics: { views } }, { merge: true })
        .then((docRef) => {
          console.log("Document Field has been updated successfully");
          // setUpdateTrigger((prev) => !prev);
          // resetData();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setDoc(docRef, { analytics: { views: 1 } }, { merge: true })
        .then((docRef) => {
          console.log("Document Field has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleImgChange = (direction) => {
    const imgLength = product?.images && product.images.length - 1;

    if (direction === "right") {
      if (imgOffSet >= imgLength * 100) {
        setImgOffSet(0);
        return;
      }
      setImgOffSet((prev) => prev + 100);
    } else {
      if (imgOffSet <= 0) {
        setImgOffSet(imgLength * 100);
        return;
      }
      setImgOffSet((prev) => prev - 100);
    }
  };

  const increaseQty = () => {
    setQty((prevQty) => {
      let newQty = prevQty + 1;
      return newQty;
    });
  };

  const decreaseQty = () => {
    setQty((prevQty) => {
      let newQty = prevQty - 1;
      if (newQty < 1) {
        newQty = 1;
      }
      return newQty;
    });
  };

  const addToCartHandler = (product) => {
    let totalPrice = qty * product.productPrice;
    const tempProduct = {
      ...product,
      prodID,
      quantity: qty,
      totalPrice,
    };
    dispatch(addToCart(tempProduct));
    dispatch(setIsModalVisible(false));
    navigate("/cart");
  };

  const modalOverlayHandler = (e) => {
    if (e.target.classList.contains("overlay-bg")) {
      dispatch(setIsModalVisible(false));
    }
  };

  const handleCopySellerNumber = () => {
    navigator.clipboard.writeText(product.seller.number);
    setHasCopied(true);
  };

  return (
    <div className="overlay-bg" onClick={modalOverlayHandler}>
      <div className="product-details-modal bg-white">
        <button
          type="button"
          className="modal-close-btn flex flex-center fs-14"
          onClick={() => dispatch(setIsModalVisible(false))}
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="details-content grid">
          {/* details left */}
          <div className="details-left">
            <ImageContainer offSet={imgOffSet} className="details-img">
              {product?.images ? (
                product.images.map((img, i) => (
                  <img key={i} src={img} alt="product" />
                ))
              ) : (
                <img src={no_image} alt="product" />
              )}
              {product?.images && product.images.length !== 1 && (
                <div
                  onClick={() => handleImgChange("left")}
                  className="left-arrow"
                >
                  <span>{"<"}</span>
                </div>
              )}
              {product?.images && product.images.length !== 1 && (
                <div
                  onClick={() => handleImgChange("right")}
                  className="right-arrow"
                >
                  <span>{">"}</span>
                </div>
              )}
            </ImageContainer>
          </div>
          {/* detials right */}
          <div className="details-right">
            <div className="details-info">
              <h3 className="title text-regal-blue fs-22 fw-5">
                {product.productName}
              </h3>
              <TextContainer className="description text-pine-green">
                {product.description &&
                  product.description.split("\n").map((d, i) => (
                    <p key={i} className="">
                      {d}
                    </p>
                  ))}
              </TextContainer>

              <div className="price fw-7 fs-24">
                Price: {formatPrice(product.productPrice)}
              </div>
              <div className="qty flex">
                <span className="text-light-blue qty-text">Qty: </span>
                <div className="qty-change flex">
                  <button
                    type="button"
                    className="qty-dec fs-14"
                    onClick={() => decreaseQty()}
                  >
                    <i className="fas fa-minus text-light-blue"></i>
                  </button>
                  <span className="qty-value flex flex-center">{qty}</span>
                  <button
                    type="button"
                    className="qty-inc fs-14 text-light-blue"
                    onClick={() => increaseQty()}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <ActionContainer>
                <button
                  type="button"
                  className="btn-primary add-to-cart-btn"
                  onClick={() => {
                    addToCartHandler(product);
                    // console.log(product);
                  }}
                >
                  <span className="btn-icon">
                    <i class="fa-solid fa-heart"></i>
                  </span>
                  <span className="btn-text">Save Item</span>
                </button>
                {product.seller?.whatsappLink && (
                  <button className="btn-primary-outline add-to-cart-btn">
                    <a
                      href={
                        product.seller.whatsappLink.includes("https://")
                          ? product.seller.whatsappLink
                          : "https://" + product.seller.whatsappLink
                      }
                    >
                      <span className="btn-icon">
                        <i
                          style={{ fontSize: "2rem" }}
                          class="fa-brands fa-whatsapp"
                        ></i>
                      </span>
                      <span className="btn-text">Contact</span>
                    </a>
                  </button>
                )}
                {!product.seller?.whatsappLink && (
                  <button
                    type="button"
                    className="btn-primary-outline add-to-cart-btn"
                    onClick={handleCopySellerNumber}
                  >
                    <span className="btn-icon">
                      <i class="fa-regular fa-copy"></i>
                    </span>
                    <span className="btn-text">
                      {hasCopied ? product.seller.number : "Copy Contact"}
                    </span>
                  </button>
                )}
              </ActionContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
