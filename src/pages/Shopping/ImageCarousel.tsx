import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const arrowStyle = (direction: string): React.CSSProperties => ({
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    padding: "10px",
    position: "absolute",
    top: "50%",
    [direction]: "10px",
    zIndex: 10,
    color: "white",
    fontSize: "18px",
    border: "none",
    cursor: "pointer",
    transform: "translateY(-50%)",
    transition: "background-color 0.3s ease",
  });

  const handleBeforeChange = (oldIndex: number, newIndex: number) => {
    setActiveIndex(newIndex);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: true,
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          position: "initial",
          bottom: "5px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}>{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "30%",
          background: i === activeIndex ? "#1976d2" : "#fff",
          border: "1px solid #000",
          margin: "0 5px",
        }}
      ></div>
    ),
    prevArrow: <button style={arrowStyle("left")}>❮</button>,
    nextArrow: <button style={arrowStyle("right")}>❯</button>,
    beforeChange: handleBeforeChange,
  };

  const displayImages =
    images.length > 0 ? images : ["/landscape-placeholder.png"];

  return (
    <div style={carouselContainerStyle}>
      <Slider {...settings}>
        {displayImages.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Product Image ${index + 1}`}
              style={imageStyle}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

const carouselContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "80%",
  margin: "auto",
  overflow: "hidden",
  borderRadius: "10px",
  boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
};

const imageStyle = {
  width: "100%",
  height: "250px",
  objectFit: "cover" as const,
  borderRadius: "10px",
  transition: "transform 0.5s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
};

export default ImageCarousel;
