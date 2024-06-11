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
  const product = useSelector((state) => state.modal.data); // Ensure correct selector
  const [imgOffSet, setImgOffSet] = useState(0);
  const [hasCopied, setHasCopied] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const queryParams = queryString.parse(window.location.search);
  const { prodID } = queryParams;

  useEffect(() => {
    if (!product) return; // Ensure product is not null or undefined

    const docRef = doc(db, "products", prodID);

    if (product.analytics) {
      const views = product.analytics.views + 1;
      setDoc(docRef, { analytics: { views } }, { merge: true })
        .then(() => {
          console.log("Document Field has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setDoc(docRef, { analytics: { views: 1 } }, { merge: true })
        .then(() => {
          console.log("Document Field has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [product, prodID]);

  const handleImgChange = (direction) => {
    const imgLength = product?.images?.length - 1;

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
    setQty((prevQty) => prevQty + 1);
  };

  const decreaseQty = () => {
    setQty((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
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

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  const getDescriptionText = () => {
    const maxLength = 45;
    if (product.description.length <= maxLength || isDescriptionExpanded) {
      return product.description;
    } else {
      return product.description.slice(0, maxLength) + "...";
    }
  };

  if (!product) return null; 

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
          <div className="details-left">
            <ImageContainer offSet={imgOffSet} className="details-img">
              {product.images && product.images.length ? (
                product.images.map((img, i) => (
                  <img key={i} src={img} alt="product" />
                ))
              ) : (
                <img src={no_image} alt="product" />
              )}
              {product.images && product.images.length !== 1 && (
                <>
                  <div
                    onClick={() => handleImgChange("left")}
                    className="left-arrow"
                  >
                    <span>{"<"}</span>
                  </div>
                  <div
                    onClick={() => handleImgChange("right")}
                    className="right-arrow"
                  >
                    <span>{">"}</span>
                  </div>
                </>
              )}
            </ImageContainer>
          </div>
          <div className="details-right">
            <div className="details-info">
              <h3 className="title text-regal-blue fs-22 fw-5">
                {product.productName}
              </h3>
              <div className="price fw-7 fs-24">
                Price: {formatPrice(product.productPrice)}
              </div>

              <ActionContainer>
                <button
                  type="button"
                  className="btn-primary add-to-cart-btn"
                  onClick={() => addToCartHandler(product)}
                >
                  <span className="btn-icon">
                    <i className="fa-solid fa-heart"></i>
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
                          className="fa-brands fa-whatsapp"
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
                      <i className="fa-regular fa-copy"></i>
                    </span>
                    <span className="btn-text">
                      {hasCopied ? product.seller.number : "Copy Contact"}
                    </span>
                  </button>
                )}
              </ActionContainer>
              <TextContainer className="description text-pine-green">
                {product.description &&
                  getDescriptionText().split("\n").map((d, i) => (
                    <p key={i} className="">
                      {d}
                    </p>
                  ))}
                {product.description && product.description.length > 100 && (
                  <button onClick={toggleDescription} className="read-more-btn">
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </TextContainer>
            
             
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
