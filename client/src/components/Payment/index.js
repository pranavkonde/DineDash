import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";

function StripePayment() {
  const { price } = useParams();
  const [product, setProduct] = useState({
    name: "DineDash",
    price: price,
    productOwner: "KnowledgeHut",
    description: "Make the Payment to Complete the Order",
    quantity: 1,
  });

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51OyWRISHXU5ytQdDO4K0DloDBXkOTR84dGtQnOshf2opdvUWVwi1xIZOxWn0byZ5SX9iLwMHDeukvvjOi2R6J1dv00J9T2YNXn"
    );
    const body = { product };
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "http://localhost:5500/api/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };
  return (
    <Card style={{ width: "20rem" }}>
      <Card.Img
        variant='top'
        src='https://1000logos.net/wp-content/uploads/2021/05/Swiggy-emblem-768x432.png'
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Button variant='primary' onClick={makePayment}>
          Pay {product.price}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default StripePayment;
